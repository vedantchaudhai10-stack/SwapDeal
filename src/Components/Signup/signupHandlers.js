import { logSignUp } from '../../firebase/analytics';
import { signInWithPopup } from '../../firebase/auth';
import { ensureUserDoc } from '../../firebase/collections';
import { Firebase } from '../../firebase/config';
import {
  validateEmail,
  validatePassword,
  validatePhone,
  validateRequired,
} from '../../utils/validation';

// 🔹 Google / Social Signup
export function handleSocialSignUp(
  providerName,
  provider,
  { setLoading, setErrors, addToast, history }
) {
  setLoading(true);
  setErrors({});

  signInWithPopup(provider)
    .then((result) => ensureUserDoc(result.user))
    .then(() => {
      logSignUp(providerName);
      addToast('Account created. Welcome!', 'success');
      setLoading(false);
      history.push('/');
    })
    .catch((error) => {
      console.log('SOCIAL ERROR:', error);
      console.log('ERROR CODE:', error.code);
      console.log('ERROR MESSAGE:', error.message);

      setLoading(false);
      setErrors({ form: error.message });
      addToast(error.message, 'error');
    });
}

// 🔹 Guest Mode
export function handleGuestContinue({ addToast, history }) {
  addToast('Browsing as guest. Sign up to post ads or chat.', 'info');
  history.push('/');
}

// 🔹 Email Signup
export function handleSubmit(
  e,
  {
    name,
    email,
    phone,
    password,
    termsAccepted,
    setLoading,
    setErrors,
    addToast,
    history,
  }
) {
  e.preventDefault();

  const err = {};

  if (validateRequired(name, 'Full name')) {
    err.name = 'Full name is required.';
  }

  const eErr = validateEmail(email);
  if (eErr) err.email = eErr;

  const pErr = validatePhone(phone);
  if (pErr) err.phone = pErr;

  const pwErr = validatePassword(password);
  if (pwErr) err.password = pwErr;

  if (!termsAccepted) {
    err.terms = 'You must accept the Terms and Conditions.';
  }

  setErrors(err);
  if (Object.keys(err).length > 0) return;

  setLoading(true);
  setErrors({});

  Firebase.auth()
    .createUserWithEmailAndPassword(email, password)
    .then(async (result) => {
      const user = result.user;

      console.log('USER CREATED:', user);

      await user.updateProfile({
        displayName: name.trim(),
      });

      await ensureUserDoc(user, {
        name: name.trim(),
        email: email.trim(),
        phone: String(phone).trim(),
      });

      // ✅ Send verification email using created user directly
      await user.sendEmailVerification();

      return user;
    })
    .then(() => {
      logSignUp('email');
      addToast(
        'Account created successfully. Check your email to verify your account.',
        'success'
      );
      setLoading(false);
      history.push('/login');
    })
    .catch((error) => {
      console.log('FULL ERROR:', error);
      console.log('ERROR CODE:', error.code);
      console.log('ERROR MESSAGE:', error.message);

      setLoading(false);
      setErrors({ form: error.message || 'Something went wrong.' });
      addToast(error.message || 'Something went wrong.', 'error');
    });
}
