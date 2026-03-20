import { useHistory } from 'react-router-dom';
import { Firebase } from '../../firebase/config';
import './Banner.css';

function Banner() {
  const history = useHistory();

  const handleExplore = () => {
    const user = Firebase.auth().currentUser;

    if (user) {
      // ✅ User logged in → go to home/products
      history.push('/');
    } else {
      // ❌ Not logged in → go to login page
      history.push('/login');
    }
  };

  return (
    <div className="bannerParentDiv">
      <div className="bannerChildDiv">
        <div className="banner">

          {/* Banner Image */}
          <img
            src={`${process.env.PUBLIC_URL || ''}/assets/images/banner.png`}
            alt="SwapDeal Banner"
          />

          {/* 🔥 Overlay Content */}
          <div className="bannerContent">
            <h1>Buy, Sell & Discover Deals 🔥</h1>
            <p>Find cars, mobiles, properties and more near you</p>

            {/* 🔥 Button with click */}
            <button className="bannerBtn" onClick={handleExplore}>
              Explore Now
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Banner;
