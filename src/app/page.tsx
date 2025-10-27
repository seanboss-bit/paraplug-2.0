import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Instagram from "@/components/Instagram";
import Navbar from "@/components/Navbar";
import NewsLetter from "@/components/Newsletter";
import Recomended from "@/components/Recomended";
import WebsiteReviews from "@/components/Review";
import ScrollingText from "@/components/ScrollingText";
import Showcase from "@/components/Showcase";
import Whatsapp from "@/components/Whatsapp";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <ScrollingText
        text="Get FREE delivery on all orders above NGN500,000 • Acrylic box available now • Show trending releases."
        speed={3}
      />
      <Navbar />
      <Hero />
      <div className="flex items-center justify-between px-6 my-[35px]">
        <Image
          alt="nike_logo"
          width={100}
          height={100}
          src={
            "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Logo_NIKE.svg/1200px-Logo_NIKE.svg.png"
          }
        />
        <Image
          alt="jordan_logo"
          width={100}
          height={100}
          src={
            "https://upload.wikimedia.org/wikipedia/en/thumb/3/37/Jumpman_logo.svg/1200px-Jumpman_logo.svg.png"
          }
        />
      </div>
      <WebsiteReviews />
      <Showcase />
      <Recomended />
      <NewsLetter />
      <Instagram />
      <Footer />
      <Whatsapp />
    </>
  );
}
