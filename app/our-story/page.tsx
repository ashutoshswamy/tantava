import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ConciergeButton from "../components/ConciergeButton";

export default function OurStoryPage() {
  return (
    <>
      <Navbar activePage="our-story" />

      {/* Hero: Meet the Designer */}
      <section className="pt-32 md:pt-48 pb-stack-lg px-4 md:px-margin-desktop max-w-container-max mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-center">
          <div className="md:col-span-5">
            <span className="font-label-md text-label-md text-primary mb-4 block uppercase tracking-widest">
              Our Visionary
            </span>
            <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-8 leading-tight">
              Meet the Designer
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-6 italic">
              &ldquo;Craftsmanship is not just about the final stitch; it is
              about the soul poured into every thread.&rdquo;
            </p>
            <p className="font-body-md text-body-md text-on-surface-variant mb-8 leading-relaxed">
              Nikitha Priya Bharana founded Tantava with a singular vision: to
              preserve the dying arts of Indian handloom while infusing them
              with a modern, editorial aesthetic that resonates with the global
              woman.
            </p>
          </div>
          <div className="md:col-span-6 md:col-start-7">
            <div className="relative group">
              <img
                alt="Nikitha Priya Bharana"
                className="w-full aspect-square object-cover rounded-lg shadow-sm group-hover:scale-[1.02] transition-transform duration-700"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCjWmzWgfw0-umEOYMYml4bFwDqX1bC5vMWKalU8OUWTX3QTfjaZQ2tzjHWDbKtEQWbfTG4tb1GHokU-Mpda8Tgeh3H5YLLM2Qz351Gi9Mxk4spBPnTO_x-2zEkBxAdMTFkmO9Hr0Fxe-npGESDAf1mKyWcYNcBaaWd6WOCJf-x8nvKd2Q0FQnQbjMRoKSjcScWcUV_JgOPvZXDjYwqNsMLa3Dm3vHW1LwyYieJrOCOGTEfTQ0GO0Qff9pTNBdDm4yIqA5VuMa3vb8"
              />
              <div className="absolute -bottom-6 -left-6 bg-secondary text-on-secondary p-8 rounded-lg shadow-lg hidden md:block">
                <p className="font-headline-sm text-headline-sm">
                  Nikitha Priya Bharana
                </p>
                <p className="font-label-md text-label-md opacity-80">
                  Founder &amp; Creative Director
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Narrative */}
      <section className="py-stack-lg bg-surface-container-low">
        <div className="px-4 md:px-margin-desktop max-w-container-max mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-headline-md text-headline-md text-primary mb-12">
              The Journey &amp; Philosophy
            </h2>
            <div className="space-y-8 font-body-lg text-body-lg text-on-surface-variant leading-relaxed text-left md:text-justify">
              <p>
                Growing up amidst the vibrant silks of South India, Nikitha
                &apos;s journey began not in a classroom, but in the weaver
                &apos;s sheds of Karnataka. Her philosophy of &lsquo;Slow
                Craft&rsquo; is a direct response to the transience of modern
                fashion. She believes that a garment should be a heritage
                piece, carrying the weight of history and the lightness of
                modern elegance.
              </p>
              <p>
                At Tantava, every collection is a dialogue between the designer
                and the artisan. We prioritize organic fibers, natural dyes,
                and traditional weaving techniques that have been passed down
                through generations. Our Bengaluru atelier serves as a
                sanctuary where these ancient rhythms meet contemporary design
                thinking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Studio Bento Grid */}
      <section className="py-stack-lg px-4 md:px-margin-desktop max-w-container-max mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-auto md:h-[800px]">
          <div className="md:col-span-2 md:row-span-2 overflow-hidden rounded-lg group relative">
            <img
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDSxAJCNolUOIQv6NvGlsBzZnCe5_1nugoalNW5MmRrpL7NHnHqeRxv-EodvxnvI7HaUEVHzOBdGUTAcRs3skQ1-TbV2a0cnW23TVZd2adFh0pqXkQUFPpLjaDUHRg78jOQX-iUsq8rE12lGKN_GMEMDc8fcQqn5rtbfQiI9wqqWjvUtcvvuD85PNFPHbVwDC_DwrsJwAhfGGxbRyt88TuJitiM3a59NNShpDJzoiU7dw5pzpdii93vf2glPmrWbUzUHaSXbUnwHYk"
              alt="Atelier Main Space"
            />
            <div className="absolute bottom-4 left-4">
              <span className="bg-secondary/80 backdrop-blur-sm text-on-secondary px-3 py-1 text-label-md font-label-md rounded border border-primary-container">
                Atelier Main Space
              </span>
            </div>
          </div>
          <div className="md:col-span-2 md:row-span-1 overflow-hidden rounded-lg group relative">
            <img
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBnMnsvjrfjkl9ZLzYMm1oEjJ_7kenSYbldEBZ63B7xpwo1GjqCCrvawmtc2shJAojFcOKMP0GslkSvIUkJBcEkBwGyKytbTUC5jmpHQMjK_wGB_sOIeSxF40VoCKdlbH29Uz08i7-IwLjeOc2yeWUfQ4aR3X0KY4Y78d3h_pSLEqnkVJneZIT5aA4zcaJV9ASlWW1YO8iIdQqsjlxLSqmZ-SNDeCjMIHYg5x8k4vhDbg3NBgJAqShHnMfIXK1QYCriY5wb6Rjmox4"
              alt="The Crafting Process"
            />
            <div className="absolute bottom-4 left-4">
              <span className="bg-secondary/80 backdrop-blur-sm text-on-secondary px-3 py-1 text-label-md font-label-md rounded border border-primary-container">
                The Crafting Process
              </span>
            </div>
          </div>
          <div className="md:col-span-1 md:row-span-1 overflow-hidden rounded-lg group relative">
            <img
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQdF9u8vGZbauJr3OQVfy_veFTGvN9zPxp6v4XubIXK8sHTCXmORK14WzvWEFVuCCkv9jWQHQoGKgxQ1wzO8k0DSezSebzxKkj88yhqeS8Zv8EwrD0kPEcV09ILIBqhOBr8AD-cIbK-dOFtoz3U5JnY6zABlXgoV3ofcTZ1gMdTKEVBm8ggl_Q1Pfe5L8SsOJeMerUHFPUJhc_CjYPfu3cajEtu9aWcYOuiyBc1PoW5kGos1D80Lo88ShPocywMNq6-r114vhtYOE"
              alt="Artisanal Details"
            />
            <div className="absolute bottom-4 left-4">
              <span className="bg-secondary/80 backdrop-blur-sm text-on-secondary px-3 py-1 text-label-md font-label-md rounded border border-primary-container">
                Artisanal Details
              </span>
            </div>
          </div>
          <div className="md:col-span-1 md:row-span-1 overflow-hidden rounded-lg group relative">
            <img
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCC9eWN0tiQNndQukJ4Bih4WSA7BPrIpPtTB5kSVAvn6Vlroe5NVvR95slUSSvS60z-zok9IV6JNPgpgPiutrvRDZ4fI85b7Fyjky8_Lw6RzRgw5-uUBlz1c3Itvc1qnpqekI_fgozerouOAj8OYCPcb199utCZadq3FipXgRYVUE9FnuR05iHzjasMnSXy1FRsiRe2QKll2-LEwY-7JoPKHEbKWO2svYd3TMFrGXbmGJyp06iMSId4ypF_4hXBMRwHNY8lBMh4B78"
              alt="Inspiration Board"
            />
            <div className="absolute bottom-4 left-4">
              <span className="bg-secondary/80 backdrop-blur-sm text-on-secondary px-3 py-1 text-label-md font-label-md rounded border border-primary-container">
                Inspiration Board
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* By Appointment */}
      <section className="py-stack-lg bg-surface-container-highest">
        <div className="px-4 md:px-margin-desktop max-w-container-max mx-auto">
          <div className="flex flex-col md:flex-row gap-gutter items-center">
            <div className="md:w-1/2">
              <h2 className="font-headline-md text-headline-md text-on-surface mb-6">
                By Appointment
              </h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant mb-8">
                Experience the tactility of our collections firsthand. We
                welcome guests to our Bengaluru studio for personalized styling
                sessions and bespoke consultations.
              </p>
              <div className="space-y-4 mb-10">
                <div className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-primary">location_on</span>
                  <p className="font-body-md text-body-md text-on-surface">
                    Tantava Atelier,
                    <br />
                    Hoskerehalli Ring Road, Bengaluru,
                    <br />
                    Karnataka, India
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-primary">calendar_month</span>
                  <p className="font-body-md text-body-md text-on-surface">
                    Monday — Saturday | 11:00 AM - 7:00 PM
                  </p>
                </div>
              </div>
              <Link
                href="/book-appointment"
                className="inline-block bg-primary text-on-primary px-8 py-4 rounded-lg font-label-md text-label-md hover:bg-primary/90 transition-all shadow-md"
              >
                Book a Consultation
              </Link>
            </div>
            <div className="md:w-1/2 w-full h-[400px] rounded-xl overflow-hidden shadow-sm grayscale hover:grayscale-0 transition-all duration-700 border border-outline-variant">
              <img
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAwjBc2T8hQ1BVImpKG88tWfUF17lGfc6dy7S2TbEp6rf9_we_RWhZgYevttOm_YfOZ6Apm4Un2_-gRiStWo6iasB5aWZQHgLO5KibF3HPWByf-9hgpim3GhSIhIzHWPkINC5RBKqx_B_Oml_CmUZzm7VsmEmhuFqcvDMNCeJe1I6tpOR9uFhiHYIVOxfYtAOm-FIgn_utROBXHMW8tVqUGsBq6ZALyHPVA_tymminRi-GFNfgKA0GScl-WmuNTjlFg"
                alt="Tantava Atelier Location"
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <ConciergeButton />
    </>
  );
}
