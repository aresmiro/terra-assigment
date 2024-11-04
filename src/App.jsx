import React, { useEffect, useState } from 'react';

const App = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const apiUrl = 'https://tf-frontend.netlify.app/trial';

  const formatUrl = (url) => {
    return url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();

        const { cta, ...filteredData } = result;
      
        setData(filteredData);

        const hasVisited = localStorage.getItem('hasVisited');
        if (!hasVisited) {
          setIsFirstVisit(true);
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (isFirstVisit) {
      localStorage.setItem('hasVisited', 'true');
    }
  }, [isFirstVisit]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const posts = document.querySelectorAll('.app__post');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fadeInUp');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    posts.forEach(post => observer.observe(post));
  }, [data]);

 useEffect(() => {
  const handleScroll = () => {
    const navbar = document.querySelector('.app__navbar');
    
    if (window.innerWidth > 767) {
      if (window.scrollY > 50) {
        navbar.style.opacity = '0.9';
        navbar.style.transition = 'opacity 0.3s ease';
      } else {
        navbar.style.opacity = '1';
      }
    } else {
      navbar.style.opacity = '1';
    }
  };

  window.addEventListener('scroll', handleScroll);
  
  return () => {
    window.removeEventListener('scroll', handleScroll);
  };
}, []);


  if (error) {
    return <div className="app__error">Error loading data: {error}</div>;
  }

  if (!data) {
    return <div className="app__loading"><div className="loading-spinner"></div></div>;
  }

  const buttonLabel = isFirstVisit ? data.hero.button_label.first_time_accessing : data.hero.button_label.second_time_accessing;
  const buttonClass = isFirstVisit ? 'app__button app__hero-button-novisited' : 'app__button app__hero-button-visited';

  return (
    <div className="app">
      {isMenuOpen && <div className="app__overlay" onClick={closeMenu}></div>}

      <nav className="app__navbar">
        <img className="app__logo" src={data.navbar.logo} alt="Logo" />
        <button className="app__hamburger" onClick={toggleMenu}>
          {!isMenuOpen ? (
            <>
              <span className="app__bar"></span>
              <span className="app__bar"></span>
              <span className="app__bar"></span>
            </>
          ) : (
            <svg className="app__close-icon" aria-label="Close menu" width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}
        </button>
        <div className={`app__menu ${isMenuOpen ? 'active' : ''}`}>
          <a href="#" className="app__menu-item">{data.navbar.menu.menu_item_1}</a>
          <a href="#" className="app__menu-item">{data.navbar.menu.menu_item_2}</a>
          <a href="#" className="app__menu-item">{data.navbar.menu.menu_item_3}</a>
        </div>
      </nav>

      <div className="app__hero" style={{ backgroundImage: `url(${data.hero.bg_image})` }}>
        <div className="app__hero-content">
          <h1 className="app__hero-title">{isFirstVisit ? data.hero.title.first_time_accessing : data.hero.title.second_time_accessing}</h1>
          <p className="app__hero-subtitle">{data.hero.subtitle}</p>
          <a className={buttonClass} href={formatUrl(data.hero.button_link)} target="_blank" rel="noopener noreferrer">
            {buttonLabel}
          </a>

          <img className="app__hero-shape-1" alt='Line shape one' src={data.hero.shapes.shape_1} />
          <img className="app__hero-shape-2" alt='Line shape two' src={data.hero.shapes.shape_2} />
        </div>
      </div>

      <div className="app__posts-container">
        <h2 className="app__posts-title">{data.body.title}</h2>
        <div className="app__posts">
          {Object.values(data.body.posts).map((post, index) => (
            <div className="app__post" key={index}>
              <img className="app__post-image" src={post.image} alt={post.title} />
              <p className={`app__post-type ${post.type === 'Type A' ? 'app__post-type-a' : 'app__post-type-b'}`}>{post.type}</p>
              <p className="app__post-info">{post.date}</p>
              <h3 className="app__post-title">{post.title}</h3>
            </div>
          ))}
        </div>
       <a className="app__button" href={formatUrl(data.body.button_link)} target="_blank" rel="noopener noreferrer">
        {data.body.button_label}
      </a>
      </div>
    </div>
  );
};

export default App;
