export default function Footer() {
  return (
    <footer className="bg-[#f8dcd2] border-t py-10 mt-12 text-sm ">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 mb-3">
            Tech Element
          </h4>
          <p>Leading provider of international business solutions.</p>
        </div>

        <div>
          <h4 className="text-md font-semibold text-gray-800 mb-2">Company</h4>
          <ul className="space-y-1">
            <li>
              <a href="/about" className="hover:underline">
                About Us
              </a>
            </li>
            <li>
              <a href="/careers" className="hover:underline">
                Careers
              </a>
            </li>
            <li>
              <a href="/blog" className="hover:underline">
                Blog
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-md font-semibold text-gray-800 mb-2">Support</h4>
          <ul className="space-y-1">
            <li>
              <a href="/contact" className="hover:underline">
                Contact
              </a>
            </li>
            <li>
              <a href="/faq" className="hover:underline">
                FAQs
              </a>
            </li>
            <li>
              <a href="/terms" className="hover:underline">
                Terms & Conditions
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-md font-semibold text-gray-800 mb-2">Contact</h4>
          <p>Email: support@Tech Element.com</p>
          <p>Phone: +1 (800) 123-4567</p>

          <p>
            Lavel, D-15, Lily Pond Center, 3 RK Mission Road, Motijheel,
            Dhaka-1203
          </p>
        </div>
      </div>
      <div className="text-center mt-8 text-gray-500">
        © {new Date().getFullYear()} Tech Element Inc. All rights reserved.
      </div>
    </footer>
  );
}
