import { getCategoryFields } from '../../data/categoryFields';
import {
  createProductDoc,
  getUserRef,
  productsRef,
} from '../../firebase/collections';
import { uploadImage } from "../../utils/cloudinaryUpload";
import { canProceed, RATE_LIMITS } from '../../utils/rateLimit';
import {
  validateAdDescription,
  validateAdTitle,
  validatePrice,
  validateRequired,
} from '../../utils/validation';

export function buildProductData(values, user, imageUrls, status, seller = {}) {
  const payload = {
    name: values.name,
    category: values.category,
    subcategory: values.subcategory || '',
    price: Number(values.price) || 0,
    description: values.description || '',
    url: imageUrls?.[0] || '',
    images: imageUrls || [],
    userId: user.uid,
    status,
    negotiable: Boolean(values.negotiable),
    listedBy: values.listedBy || '',
    adType: values.adType || 'for_sale',
    priceType: values.priceType || 'fixed',
    tags: Array.isArray(values.tags) ? values.tags : [],
    videoUrl: values.videoUrl || '',
    returnPolicy: values.returnPolicy || 'no_returns',
    paymentMethods: Array.isArray(values.paymentMethods)
      ? values.paymentMethods
      : [],
    contactPreference: values.contactPreference || 'both',
    availableFrom: values.availableFrom || null,
    location:
      values.location && (values.location.city || values.location.state)
        ? values.location
        : {},
    delivery:
      values.delivery && typeof values.delivery === 'object'
        ? values.delivery
        : {},
    warranty:
      values.warranty && typeof values.warranty === 'object'
        ? values.warranty
        : {},
    extra: (() => {
      if (!values.extra || Object.keys(values.extra).length === 0) return {};
      const extraClean = {};
      Object.entries(values.extra).forEach(([k, v]) => {
        if (v !== '' && v != null) extraClean[k] = v;
      });
      return extraClean;
    })(),
    condition: values.condition || '',
  };

  return createProductDoc(payload, {
    name:
      seller.name || user.displayName || user.email?.split('@')[0] || 'User',
    avatar: seller.avatar || user.photoURL || '',
    verified: Boolean(seller.verified),
    badgeLevel: seller.badgeLevel || 'new',
  });
}

export function handleSubmit({
  values,
  user,
  addToast,
  history,
  setLoading,
  setErrors,
}) {

  if (!canProceed('adCreate', RATE_LIMITS.AD_CREATE_MS)) {
    addToast('Please wait a moment before posting another ad.', 'info');
    return;
  }

  const err = {};

  if (validateRequired(values.category, 'Category'))
    err.category = 'Please select a category.';

  const tErr = validateAdTitle(values.name);
  if (tErr) err.name = tErr;

  const dErr = validateAdDescription(values.description);
  if (dErr) err.description = dErr;

  const pErr = validatePrice(values.price);
  if (pErr) err.price = pErr;

  if (!values.condition?.trim())
    err.condition = 'Please select a condition.';

  const filesToUpload = values.images.filter((i) => i instanceof File);
  const existingUrls = values.images.filter((i) => typeof i === 'string');

  if (filesToUpload.length === 0 && existingUrls.length === 0)
    err.images = 'Please add at least one image.';

  if (!values.location?.state || !values.location?.city)
    err.location = 'Please select your state and city.';

  const catFields = getCategoryFields(values.category);
  const extra = values.extra || {};

  catFields.forEach((f) => {
    if (f.required) {
      const val = extra[f.key];
      if (val === undefined || val === null || String(val).trim() === '') {
        err[`extra.${f.key}`] = `${f.label.replace(/\s*\*/, '')} is required`;
      }
    }
  });

  setErrors(err);

  if (Object.keys(err).length > 0) {
    const count = Object.keys(err).length;
    addToast(
      `Please fix ${count} error${count > 1 ? 's' : ''} before posting.`,
      'error'
    );
    return;
  }

  setLoading(true);

  const uploadPromises = filesToUpload.map((file) => uploadImage(file));

  Promise.all([Promise.all(uploadPromises), getUserRef(user.uid).get()])
    .then(([urls, userSnap]) => {
      const seller = userSnap.exists ? userSnap.data() : {};
      const data = buildProductData(values, user, urls, 'active', seller);
      return productsRef().add(data);
    })
    .then(() => {
      addToast('Ad posted successfully!', 'success');
      history.push('/');
    })
    .catch(() => {
      setLoading(false);
      addToast('Failed to post ad. Try again.', 'error');
    });
}

export function handleSaveDraft({
  values,
  user,
  addToast,
  history,
  setLoading,
  setErrors,
}) {

  const err = {};

  if (!values.name && !values.category) {
    if (!values.name) err.name = 'Add a title to save draft.';
    if (!values.category) err.category = 'Select a category to save draft.';
  }

  if (setErrors) setErrors(err);

  if (Object.keys(err).length > 0) {
    addToast('Add at least a title or category to save draft.', 'error');
    return;
  }

  setLoading(true);

  const filesToUpload = values.images.filter((i) => i instanceof File);

  const uploadPromises = filesToUpload.length
    ? Promise.all(filesToUpload.map((file) => uploadImage(file)))
    : Promise.resolve([]);

  Promise.all([uploadPromises, getUserRef(user.uid).get()])
    .then(([urls, userSnap]) => {
      const seller = userSnap.exists ? userSnap.data() : {};
      const data = buildProductData(
        values,
        user,
        urls.length ? urls : [],
        'draft',
        seller
      );
      return productsRef().add(data);
    })
    .then(() => {
      setLoading(false);
      addToast('Draft saved successfully!', 'success');
      history.push('/dashboard');
    })
    .catch((e) => {
      setLoading(false);
      addToast('Failed to save draft. Please try again.', 'error');
      console.error('Draft save error:', e);
    });
}
