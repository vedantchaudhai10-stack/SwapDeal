import { useContext, useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import SearchIcon from '../../assets/SearchIcon';
import SellButton from '../../assets/SellButton';
import SellButtonPlus from '../../assets/SellButtonPlus';
import { AuthContext } from '../../contextStore/AuthContext';
import { useSearchFilter } from '../../hooks/useSearchFilter';
import NotificationBell from '../Notifications/NotificationBell';
import './Header.css';
import LocationDropdown from './LocationDropdown';
import MobileMenu from './MobileMenu';
import UserDropdown from './UserDropdown';

function Header() {
  const history = useHistory();
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const loginState = { from: { pathname: location.pathname } };

  const {
    filteredData,
    wordEntered,
    isOpen,
    wrapperRef,
    handleFilter,
    clearInput,
    closeDropdown,
    handleSelectedSearch,
    handleKeyDown,
  } = useSearchFilter();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearchSubmit = () => {
    if (wordEntered.trim()) {
      history.push(`/search?q=${encodeURIComponent(wordEntered.trim())}`);
    } else {
      history.push('/search');
    }
    closeDropdown();
  };

  const handleEmptyClick = () => {
    history.push('/search');
  };

  return (
    <div className="headerParentDiv">
      <div className="headerChildDiv">

        <button
          type="button"
          className="headerHamburger"
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Open menu"
        >
          <span />
          <span />
          <span />
        </button>

        <Link to="/" className="brandName">
  <img
    src={`${process.env.PUBLIC_URL}/assets/images/swapdeal-logo.png`}
    alt="SwapDeal"
    className="headerLogo"
  />
  <span className="logoText">SwapDeal</span>
</Link>

        <div className="headerLocationWrap">
          <LocationDropdown />
        </div>

        <div className="headerSearchWrap" ref={wrapperRef}>
          <div className="headerSearchInner">

            <input
              type="text"
              placeholder="Find Cars, Mobile Phones and more..."
              value={wordEntered}
              onChange={handleFilter}
              onKeyDown={(e) => {
                handleKeyDown(e);
                if (e.key === 'Enter') handleSearchSubmit();
              }}
            />

            {wordEntered.trim() && (
              <button
                type="button"
                className="headerClearBtn"
                onClick={clearInput}
                aria-label="Clear search"
              >
                &times;
              </button>
            )}

            <button
              type="button"
              className="headerSearchBtn"
              onClick={
                wordEntered.trim() ? handleSearchSubmit : handleEmptyClick
              }
              aria-label="Search"
            >
              <SearchIcon />
            </button>

          </div>

          {isOpen && filteredData.length > 0 && (
            <div className="dataResult-header">
              {filteredData.slice(0, 15).map((value, key) => (
                <div
                  key={value.id || key}
                  className="dataItem-header"
                  role="button"
                  tabIndex={0}
                  onClick={() => handleSelectedSearch(value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleSelectedSearch(value);
                    }
                  }}
                >
                  <p>{value.name}</p>
                </div>
              ))}
            </div>
          )}
        </div>



        {/* RIGHT SIDE MENU */}
        <div className="headerRight">

          {user ? (
            <>

              {/* ADMIN PANEL BUTTON */}
              {user.email === "vedantchaudhai10@gmail.com" && (
                <Link to="/admin" className="adminPanelBtn">
                  🛠 ADMIN
                </Link>
              )}

              <NotificationBell />
              <UserDropdown />

            </>
          ) : (
            <Link
              to={{ pathname: '/login', state: loginState }}
              className="headerLoginLink"
            >
              Login
            </Link>
          )}

        </div>

        <Link to="/create" className="headerSellLink">
          <div className="sellMenu">
            <SellButton />
            <div className="sellMenuContent">
              <SellButtonPlus />
              <span>SELL</span>
            </div>
          </div>
        </Link>

      </div>

      <MobileMenu
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

    </div>
  );
}

export default Header;
