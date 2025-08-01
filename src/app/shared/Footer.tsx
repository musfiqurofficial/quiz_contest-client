"use client";

import { Building, Mail, PhoneCall } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="relative text-blue-900 mt-20 overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 -z-10 opacity-10">
        <Image
          src="/Asset/prducts/footer.avif"
          alt="Footer background"
          layout="fill"
          objectFit="cover"
          priority
        />
      </div>

      <div className="container mx-auto px-4 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Company Info */}
        <div>
          <h4 className="text-xl font-bold mb-4">Tech Element</h4>
          <p className="text-sm text-gray-800">
            Empowering global businesses with cutting-edge technology and smart
            solutions.
          </p>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-3 text-gray-800">Company</h4>
          <ul className="space-y-2 text-sm text-gray-900">
            <li>
              <a href="/about" className="hover:text-white">
                About Us
              </a>
            </li>
            <li>
              <a href="/careers" className="hover:text-white">
                Careers
              </a>
            </li>
            <li>
              <a href="/blog" className="hover:text-white">
                Blog
              </a>
            </li>
          </ul>
        </div>

        {/* Links - Support */}
        <div>
          <h4 className="text-lg font-semibold mb-3 text-gray-800">Support</h4>
          <ul className="space-y-2 text-sm text-gray-900">
            <li>
              <a href="/contact" className="hover:text-blue-800">
                Contact
              </a>
            </li>
            <li>
              <a href="/faq" className="hover:text-blue-800">
                FAQs
              </a>
            </li>
            <li>
              <a href="/terms" className="hover:text-blue-800">
                Terms & Conditions
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-lg font-semibold mb-3 text-gray-800">
            Get in Touch
          </h4>
          <p className="text-sm flex items-start gap-2  text-gray-900 mb-2">
            <Mail className="w-4 h-4 text-[#f25b29]" /> support@techelement.com
          </p>
          <p className="text-sm text-gray-400 mb-2 flex gap-1 items-start">
            {" "}
            <PhoneCall className="w-4 h-4 text-[#f25b29]" /> +1 (800) 123-4567
          </p>
          <p className="text-sm text-gray-400 flex gap-2 items-start">
            <Building className="w-10 h-10 text-[#f25b29]" /> Level D-15, Lily
            Pond Center, 3 RK Mission Road, Motijheel, Dhaka-1203
          </p>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="text-center text-xs text-gray-500 py-6 border-t border-gray-800">
        © {new Date().getFullYear()} Tech Element Inc. All rights reserved.
      </div>
    </footer>
  );
}
