export default function Footer() {
  return (
    <footer class="footer">
      <div class="footer-top">
        <div class="container">
          <div class="inner-content">
            <div class="row">
              <div class="col-lg-3 col-md-4 col-12">
                <div class="footer-logo">
                  <a href="index.html">
                    <img
                      src={require("../../assets/images/logo/white-logo.png")}
                      alt="logo"
                    />
                  </a>
                </div>
              </div>
              <div class="col-lg-9 col-md-8 col-12">
                <div class="footer-newsletter">
                  <h4 class="title">
                    Subscribe to our Newsletter
                    <span>
                      Get all the latest information, Sales and Offers.
                    </span>
                  </h4>
                  <div class="newsletter-form-head">
                    <form
                      action="#"
                      method="get"
                      target="_blank"
                      class="newsletter-form"
                    >
                      <input
                        name="EMAIL"
                        placeholder="Email address here..."
                        type="email"
                      />
                      <div class="button">
                        <button class="btn">
                          Subscribe<span class="dir-part"></span>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="footer-middle">
        <div class="container">
          <div class="bottom-inner">
            <div class="row">
              <div class="col-lg-3 col-md-6 col-12">
                <div class="single-footer f-contact">
                  <h3>Get In Touch With Us</h3>
                  <p class="phone">Phone: +1 (900) 33 169 7720</p>
                  <ul>
                    <li>
                      <span>Monday-Friday: </span> 9.00 am - 8.00 pm
                    </li>
                    <li>
                      <span>Saturday: </span> 10.00 am - 6.00 pm
                    </li>
                  </ul>
                  <p class="mail">
                    <a href="mailto:support@shopgrids.com">
                      support@shopgrids.com
                    </a>
                  </p>
                </div>
              </div>
              <div class="col-lg-3 col-md-6 col-12">
                <div class="single-footer our-app">
                  <h3>Our Mobile App</h3>
                  <ul class="app-btn">
                    <li>
                      <a href="#">
                        <i class="lni lni-apple"></i>
                        <span class="small-title">Download on the</span>
                        <span class="big-title">App Store</span>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i class="lni lni-play-store"></i>
                        <span class="small-title">Download on the</span>
                        <span class="big-title">Google Play</span>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div class="col-lg-3 col-md-6 col-12">
                <div class="single-footer f-link">
                  <h3>Information</h3>
                  <ul>
                    <li>
                      <a href="#">About Us</a>
                    </li>
                    <li>
                      <a href="#">Contact Us</a>
                    </li>
                    <li>
                      <a href="#">Downloads</a>
                    </li>
                    <li>
                      <a href="#">Sitemap</a>
                    </li>
                    <li>
                      <a href="#">FAQs Page</a>
                    </li>
                  </ul>
                </div>
              </div>
              <div class="col-lg-3 col-md-6 col-12">
                <div class="single-footer f-link">
                  <h3>Shop Departments</h3>
                  <ul>
                    <li>
                      <a href="#">Computers & Accessories</a>
                    </li>
                    <li>
                      <a href="#">Smartphones & Tablets</a>
                    </li>
                    <li>
                      <a href="#">TV, Video & Audio</a>
                    </li>
                    <li>
                      <a href="#">Cameras, Photo & Video</a>
                    </li>
                    <li>
                      <a href="#">Headphones</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <div class="container">
          <div class="inner-content">
            <div class="row align-items-center">
              <div class="col-lg-4 col-12">
                <div class="payment-gateway">
                  <span>We Accept:</span>
                  <img
                    src={require("../../assets/images/footer/credit-cards-footer.png")}
                    alt="#"
                  />
                </div>
              </div>
              <div class="col-lg-4 col-12">
                <div class="copyright">
                  <p>
                    Designed and Developed by
                    <a
                      href="https://graygrids.com/"
                      rel="nofollow"
                      target="_blank"
                    >
                      GrayGrids
                    </a>
                  </p>
                </div>
              </div>
              <div class="col-lg-4 col-12">
                <ul class="socila">
                  <li>
                    <span>Follow Us On:</span>
                  </li>
                  <li>
                    <a href="#">
                      <i class="lni lni-facebook-filled"></i>
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <i class="lni lni-twitter-original"></i>
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <i class="lni lni-instagram"></i>
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <i class="lni lni-google"></i>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
