"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ConciergeButton from "./components/ConciergeButton";

const testimonials = [
  {
    quote:
      "The attention to detail in my wedding lehenga was unparalleled. I felt like royalty. The design process was so collaborative and personal.",
    author: "Anjali R., Mumbai",
  },
  {
    quote:
      "Tantava transformed my vision into a masterpiece. Every stitch tells a story of artistry and passion. I will cherish this piece forever.",
    author: "Priya M., Bengaluru",
  },
  {
    quote:
      "The quality and craftsmanship is beyond compare. Nikitha and her team made my bridal experience truly unforgettable.",
    author: "Deepa S., Delhi",
  },
];

const newArrivals = [
  {
    name: "Burgundy Zari Silk Saree",
    price: "₹42,000",
    badge: "HANDCRAFTED",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAxfEFOJR7eUb02ny8c8aJ11yyVWDopvGAgqdCV46XfQEbG080Zb_UM2Lww7HUuJ8zkSumRtfTdh-v9CvmIQlpUBbKRnwCBIkcgxi4oAI50PSOnOOtIJiG8dXiKQEwWpkrj5rY9I9mpGo9b6S8utBLMHR77GNyCg0v4aI7qAT6F-MemhvFL3I9kEEzakxeazEZSfujBzB9tMk1lewpCKxhHwoXqp94d_MAmoERTwR5Eqsb6JbAdPWiEXVLnblgHzWyiMpfv-x_dXDo",
  },
  {
    name: "Dusty Rose Fusion Ensemble",
    price: "₹28,500",
    badge: "TRENDING",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDSIuDQbh8IIh7sZnfDHYn77pGQNyK8Ota9iiEgHw33QFEaCbgbgNtCgtIzkqWDDcFW3Ea7qQ9JWAYr-ke9C3PVQG3F06RFSPyNtsvTMs73u6MEswNrS_QBeXsmEL9wxzPg8SVt5JfkDy_xWRKXa_mIo2TDSK4SDa6cIRipevaZDVxD48ad9m3JZLG07d0RkjqzXgBb1vvIxMou1i1hbxK3IoBGFDBX8ggRwBf2p018P1FoGZlXryw5nswb-QqrcUjYle68I7x0rGg",
  },
  {
    name: "Ivory Organza Lehenga",
    price: "₹64,000",
    badge: null,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuA_lLOKJqdhF4StqSlzNgGicgYt6zBcOwoeqaR92eUlFfaIA45axMAVEUbXJN9VoyvLfctw5gAAeGS4ohW-eMJwQDB3rFRC7z3jAIZdssKd-E1Ed1nFgBVxFcDUBw2bOEMfkxgUUy0ExBiFCUr3Aw7eUBo92tpTT4JQn9CuUnoauRps3TJel5yzIucBVq30zU1Y5QjY1YJ6aAVREah7HMaVF1tJs6bNoF8YnzQomOcl4i3UhCXyNEtLDbmpl5V20OnAdT6E9yy9nIo",
  },
  {
    name: "Emerald Embellished Kurta Set",
    price: "₹18,900",
    badge: null,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBdo0YdwtD6hV2i-prDCGaFw0psh_2nvgdJZlfG9Fg3RaMlthF4rx_rKHvG9uoLlJBNRrC5fvKjdcwVDiPhtRWZM7YtmS8LGR263s7wSfcRJIt2dY3DHmfcUKY4S1DSpqrDjbImPoYcMtw1wn5yMobuimqh2CU6wOgyLxvevyauv-LBV1lIn4g_47ApAlr6ytl9ycyHYwnHlS4dfh28ZL02DC73Sb7Pfvx67-Tdgdl5mPYk3pCk_6eCE0u-y4GxyS0IQspkGSBMfuM",
  },
];

const instaGrid = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBckJzbPa1VaPciLz5-Stj4BVQ_nMwf-eL36yP1Y8w1B-kywINxnsk179zwjkqAasw6UoXzvo5s09G6sT1N9ifYIFi6XHU9rq5gUhxulrCu3uJuNQy3jJwtNkC-IM6C9oRiuOosvREIwgjXZ5-prq_V73HxOqhRpAr12m1C6SoV6drL24-Hc4XvY3n82gvel7PzJ5iimtGRb6IsSizVI-bZhV7zvq1LGZM-qnudow5_kNOFJOPL9Y2vM5NVVpE6DXFlNp2flvNkl6o",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBDj_cUwkXvsTvTFo_HQ2Iwuw6oSq99CxZNcBsxta7T36F00ox_6WrJytGvgv3GCAZL7yOteYxKHtrBKSkjPXDbyjpFX-Itxc3Skz0RGEGJHT59aeKel-Z8hWcoH3YlAypNEpwBBe3eNhRcil87dK224dkJ17gfZza-c49CFjpukXUopEfH7J6GZwzVW4C1o5f37R_-OIG4Kg6yqQ587HqvNrMSgaB4oulOMH6qib61OES8Vj5rJfbzFegCpUZVm_toT0y1sxti7xY",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCCxuq2ZHtKURhjgx24Vp7AjZmwzmuuKPLAv54-jmNjKhEYYIQI1IFmVA0SEAz06mGRpBDJXR3YrrCgJMi7cPetPU2OSiwEXC6CEEzumImn66zyoCAHcvKnRE5CSqUbdQSQKezZ_ro9sPtAkcbNGrRsbKpC0-7Flj9yGQW-HFMP4he1ra5dHq3ZDqHKgMK6krCQ3LxAXoled_PkKmFBzWgeGgkYR3xtfNIk1IfC-PC0KFaAv5p3jxz4WhAxy5f8jlZvtWPG-_DVVjY",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAv_qEL3eGUbtVWZYHYqlUMlzvSPVSWjxXhjKOCeloiYF8bb7F_dcCK0qvQ_06q4vnXyIap973eR769dnT8fHb8aErBcn2BRdYClVOD650Hgt-Baoar-__ISjvtjwRGNGiHZxMb7qMO90sIGmYJNtvtko8VoGehKxwLWR487ZqAlBW_OSZh-A-8gDhqqPHBZ-PtDNmYAOlGe7WJycFXfnIo-dGUqu7otE0s8yfRjcMHtup2yTlc15EZtOogTOmhUCcHUnjmFUegge0",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuD8yV43O0UPitofLpcq9nKTny7YGQ4teLhzbTvt6lygKeIfW4npwJPrwWkKybDO_y-6mQAbcNhI2gUyONmDgAmq7L9lHwDnX5C2EKM05jgb6fLMl3W5MYyznp5F2VxfNu17ZFeJIiCvo6szFc5kOnPRTYSj0LPdWA84Xzm_X0VhPO7ggSEHzyGUGWuQpwp03YwyRf4GUPPbMgV8JkF2dobKjVUXPfU_zpB0sICFWtbDyvmc_7T6Tz5d-u1JJnHcvd_XLDBvIx0O31w",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDVZ-NoPYyBsSspTfRYohBe912xvurgC6VTswm5qA5YOcdpSjQ1XXSiGHIry6TpTJkUSxGbSID3ev7b1yqPq_ujxmY18erNW_XS8hqiKF1KEKa_VRiK8950CA_Y-Xgy4Sz-AYtw41pZz3j6Z1lOeBg0DkE8PXLew54saARitLo5EJMmt5BLExwKWpF7jYPNyuZ-nFzbDYewCsxbWjiFJpqfF9LWP6Qio2HJcTuxDFOWN23X9Zhg5i24zKxB27IIF836cD-KBazMdf0",
];

export default function HomePage() {
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  return (
    <>
      <Navbar />

      {/* Hero */}
      <header className="relative h-screen min-h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/30 z-10" />
          <img
            alt="Tantava Hero"
            className="w-full h-full object-cover hero-zoom"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCsxoNU-T7HvRebuq1YDPqVcbBlIwKVhg6mNuDPa6oQlYNDNptMLMyMxQDUpdzOiobI_14-PEB-ItkFSTNJOtzb8BLco84dgnVPcirWGpUtf-ZqkuAWJP7f83SgGZ3kq0vi3tlC209r-VIRtlyWLjHzF3FBVKAH0ESXLFmNB8zf0xZCE8wFBOMOMUfXUp61O8uP8FUhEWL7kv4DX8X0HI-tJdUpTOoTFvrWYY2QzXOROPIxZIef7mD8ZK23I9MU32ZG5E5_BGXiUvk"
          />
        </div>
        <div className="relative z-20 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full">
          <div className="max-w-2xl">
            <h1 className="font-headline-lg-mobile md:font-display-lg text-headline-lg-mobile md:text-display-lg text-white mb-6">
              Tantava — Where Tradition Meets Contemporary
            </h1>
            <p className="font-body-lg text-body-lg text-white/90 mb-8 max-w-lg">
              Discover a curated collection of handcrafted elegance, celebrating
              the timeless artistry of Indian heritage through a modern lens.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/shop"
                className="bg-secondary text-on-secondary px-10 py-4 rounded-lg font-label-md text-label-md hover:scale-[1.02] transition-transform duration-300 text-center"
              >
                Shop Now
              </Link>
              <button className="border border-white text-white px-10 py-4 rounded-lg font-label-md text-label-md hover:bg-white/10 transition-all duration-300 backdrop-blur-sm">
                View Lookbook
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* New Arrivals */}
      <section className="py-stack-lg bg-surface">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="font-headline-md text-headline-md text-on-surface mb-2">
                New Arrivals
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Our latest handcrafted masterpieces, fresh from the loom.
              </p>
            </div>
            <Link
              href="/shop"
              className="hidden md:flex items-center gap-2 text-primary font-label-md text-label-md hover:gap-3 transition-all duration-300"
            >
              View All Collections{" "}
              <span className="material-symbols-outlined text-[18px]">
                arrow_forward
              </span>
            </Link>
          </div>

          <div className="flex overflow-x-auto gap-gutter pb-8 custom-scrollbar scroll-smooth">
            {newArrivals.map((item) => (
              <div
                key={item.name}
                className="min-w-[280px] md:min-w-[340px] group cursor-pointer"
              >
                <div className="relative aspect-[0.73] overflow-hidden rounded-lg mb-4 shadow-sm group-hover:shadow-md transition-shadow duration-300">
                  <img
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    src={item.img}
                  />
                  {item.badge && (
                    <div className="absolute top-4 left-4 bg-secondary border border-primary-container px-3 py-1 text-on-secondary font-label-md text-[12px] flex items-center gap-1">
                      {item.badge}
                    </div>
                  )}
                </div>
                <h3 className="font-headline-sm text-[18px] text-on-surface mb-1">
                  {item.name}
                </h3>
                <p className="font-label-md text-label-md text-primary mb-2">
                  {item.price}
                </p>
                <button className="w-full py-3 border border-outline-variant rounded-lg font-label-md text-label-md text-on-surface-variant hover:bg-surface-container transition-colors">
                  Add to Bag
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Curated Collections Bento Grid */}
      <section className="py-stack-lg bg-surface-container-low">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <h2 className="font-headline-md text-headline-md text-on-surface text-center mb-16 italic">
            Curated Collections
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-12 md:grid-rows-2 gap-gutter h-auto md:h-[800px]">
            <div className="md:col-span-8 md:row-span-2 relative group overflow-hidden rounded-lg">
              <img
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuALwf9w4zbv9apFBpM6urohqaRBt_SOWRXjMWRfrtXWV1LCRY5sSxTtG0Yu477ClwkfXBLy3ZMoYBVq9uh52alDpOYyMqjvMr24XmAH52DmDhPMZ0PGHKFNZBEAtb0aiiGBwplOAvvhHcVp6v-PuPG3Sr4n74YhWJukVFb4pzhMyk0n5urONuz8tNrPJGDLiYh47ulyBCGxFDS0VFz7naWHKOxOJdVQZj_Jn5sPyltHKQMxutvyoKs5YwwXY8SXDi1Y2sojFycL9ug"
                alt="Lehengas collection"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-10 left-10 text-white">
                <h3 className="font-headline-lg text-headline-lg mb-4">
                  Lehengas
                </h3>
                <p className="font-body-md text-body-md mb-6 max-w-sm">
                  Ethereal silhouettes for your most cherished moments.
                </p>
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 font-label-md text-label-md uppercase tracking-widest border-b border-white/40 pb-1 hover:border-white transition-all"
                >
                  Explore Category
                </Link>
              </div>
            </div>
            <div className="md:col-span-4 md:row-span-1 relative group overflow-hidden rounded-lg">
              <img
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBkocyoz8KWlXcG2qsjYDM3WRdDH3Ir076AW29ZemhTqyz3rBLt_a4ZTCbmmA87Wld_im6eQwzujHVuLjxdBLt45X1Bng_-FIEl2aAup01LWplExfgehxFD4MUUFyDHX8SvkOKY63yHWwQkcdbplG3HCflle4iRtSx4sB7aRo9v59DuClBIWvrpgd5qb3oCwriwd4XVCA5B91gpGr6jiey6dugtlsq54CMRwH-IhvdC1Fw5gy2VoaRK-NrLLImYXegWrX4q9idakhc"
                alt="Sarees"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="font-headline-md text-headline-md text-white">
                  Sarees
                </h3>
              </div>
            </div>
            <div className="md:col-span-4 md:row-span-1 relative group overflow-hidden rounded-lg">
              <img
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBi5IvHuqF_0swwGlT1rk13kOJz_1UgEPl53-YHX_9NrtMAdGeJzr0_gMIqUYbHSI02961QfOdjde8QfpjneTYZsjSlEmOvkJJlJ5lJBPWA9UL7uSZySA4GPB2zqRUBoA5hL0PJ1KQ2Kyc4u0sMPS9f_QFkOmiI7GHId4F08ly8_pzbqwDsBexVvCUEwzFoAa7GJMCO7JGm-hlznlykokGsRRLscGRGARzFbj6UsbEIJsP3PxrtScGzFpF6HGarVvkl2ubkBkZGZX4"
                alt="Kurta Sets and Fusion"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="font-headline-md text-headline-md text-white text-center">
                  Kurta Sets &amp; Fusion
                </h3>
              </div>
            </div>
          </div>

          <div className="mt-gutter grid grid-cols-1 md:grid-cols-2 gap-gutter h-auto md:h-[400px]">
            <div className="relative group overflow-hidden rounded-lg">
              <img
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAPes-rWGHHDDueIAP8bz-ONnZ2il2H3NgmsNbKe976m-qOPkBaBXGbABwEw7wUVqIEeUOQoqAxK3o3qZ-ugLoSX2lgfmMD8WmzjqneHfWzu5cktcbK1QFXRAaMOfFlHQ8Wp3AjKzHWkUVRVElD3oN66KYgVFKy_20x4JGCcAPwAvW5EAZEzTucQu6672Wmfzu7JElGw8ccwOwW2SDCyifGEBiEwQGlXsMiEpFsBadN-Do58bcnhVkFB43rPVuus_KF6UhMyVWLSUw"
                alt="Evening Gowns"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <h3 className="font-headline-md text-headline-md text-white">
                  Evening Gowns
                </h3>
              </div>
            </div>
            <div className="relative group overflow-hidden rounded-lg">
              <img
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBCOqcJ7bVXSvuTwIdpKFD2GrJBx48Ey0ZNJuTvksRRedX6okT_AR9q2be92ImOuklKzfr8LqhXFp2-OxWcRpVOF_e1ixif4q8pBSMdzmMIMpPZjyJI00FNYghPL_32cpP2JsaQO-7DElhdr83ckBeclZFIQVgK_igx7NC9fIl5GJ9kUhqaK8yNFz1_0lyYboVjT-dcOlzjpFwG6xRV8tf71LDQUGph02u6O5kQUgZQmyIWqCcKV1kfJ6HA7GaQeM7wCIBjMbNdq_M"
                alt="Bridal Couture"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <h3 className="font-headline-md text-headline-md text-white">
                  Bridal Couture
                </h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-stack-lg bg-surface">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="w-full md:w-1/2 relative">
              <div className="aspect-square rounded-lg overflow-hidden relative z-10 shadow-xl">
                <img
                  alt="Nikitha Priya Bharana"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCjWmzWgfw0-umEOYMYml4bFwDqX1bC5vMWKalU8OUWTX3QTfjaZQ2tzjHWDbKtEQWbfTG4tb1GHokU-Mpda8Tgeh3H5YLLM2Qz351Gi9Mxk4spBPnTO_x-2zEkBxAdMTFkmO9Hr0Fxe-npGESDAf1mKyWcYNcBaaWd6WOCJf-x8nvKd2Q0FQnQbjMRoKSjcScWcUV_JgOPvZXDjYwqNsMLa3Dm3vHW1LwyYieJrOCOGTEfTQ0GO0Qff9pTNBdDm4yIqA5VuMa3vb8"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-full h-full border-2 border-primary-container rounded-lg z-0" />
            </div>
            <div className="w-full md:w-1/2">
              <span className="font-label-md text-label-md text-primary tracking-widest uppercase mb-4 block">
                The Visionary
              </span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface mb-6">
                Nikitha Priya Bharana
              </h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant mb-6 italic leading-relaxed">
                &ldquo;Tantava is not just a boutique; it&apos;s a revival of
                our roots. Every thread we weave tells a story of an
                artisan&apos;s soul, brought to life for the modern woman who
                values her heritage as much as her individuality.&rdquo;
              </p>
              <p className="font-body-md text-body-md text-on-surface-variant mb-8">
                Founded in Bengaluru, Tantava celebrates the confluence of
                time-honored Indian craftsmanship and contemporary fashion
                sensibilities. Nikitha&apos;s journey began with a passion for
                preserving the dying arts of hand-weaving and intricate
                Zardozi, reimagining them into silhouettes that resonate with
                global aesthetics.
              </p>
              <Link
                href="/our-story"
                className="text-primary font-bold font-label-md text-label-md flex items-center gap-2 group"
              >
                Read Our Story{" "}
                <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">
                  east
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Appointment Banner */}
      <section className="my-stack-lg px-margin-mobile md:px-margin-desktop">
        <div className="max-w-container-max mx-auto bg-secondary rounded-xl p-12 md:p-20 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="grid grid-cols-6 h-full w-full">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="border-r border-on-secondary" />
              ))}
            </div>
          </div>
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="font-headline-lg text-headline-lg text-on-secondary mb-6">
              Your Dream Ensemble Awaits
            </h2>
            <p className="font-body-lg text-body-lg text-on-secondary/80 mb-10">
              Book a personalized one-on-one consultation with our designers at
              our Bengaluru studio or virtually via video call.
            </p>
            <Link
              href="/book-appointment"
              className="inline-block bg-primary-container text-on-primary-container px-12 py-5 rounded-lg font-label-md text-label-md hover:scale-105 transition-all shadow-lg"
            >
              Book Appointment
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-stack-lg bg-surface-container-low">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-center">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-12 italic">
            The Tantava Experience
          </h2>
          <div className="relative overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${testimonialIndex * 100}%)` }}
            >
              {testimonials.map((t, i) => (
                <div key={i} className="min-w-full px-4">
                  <div className="max-w-3xl mx-auto">
                    <span className="material-symbols-outlined text-primary text-[48px] mb-6 opacity-30">
                      format_quote
                    </span>
                    <p className="font-headline-sm text-headline-sm text-on-surface mb-8">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                    <h4 className="font-label-md text-label-md text-primary font-bold uppercase tracking-widest">
                      — {t.author}
                    </h4>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-4 mt-12">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setTestimonialIndex(i)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    i === testimonialIndex
                      ? "bg-primary"
                      : "bg-outline-variant hover:bg-primary"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Instagram Feed */}
      <section className="py-stack-lg">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-headline-sm text-headline-sm">
              @TantavaOfficial
            </h2>
            <a
              href="https://instagram.com/_tantava"
              className="text-primary font-label-md text-label-md"
            >
              Follow on Instagram
            </a>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {instaGrid.map((src, i) => (
              <div
                key={i}
                className="aspect-square rounded-lg overflow-hidden group relative"
              >
                <img
                  src={src}
                  alt={`Instagram post ${i + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="material-symbols-outlined text-white">
                    favorite
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <ConciergeButton />
    </>
  );
}
