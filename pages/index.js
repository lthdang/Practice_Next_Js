import Head from "next/head";
import Layout, { siteTitle } from "../components/layout";
import utilStyles from "../styles/utils.module.css";

import Image from "next/image";

export default function Home() {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <div className={utilStyles.center}>
          <Image
            src="/images/a.jpg"
            alt="First Post"
            width={500}
            height={300}
          />
        </div>
        <p>
          Hello, I’m <b>Hải Đăng</b>. I’m a software engineer specializing in
          building (and occasionally designing) exceptional digital experiences.
          Currently, I’m focused on building accessible, human-centered products
          at <a href="https://www.nextjs.org">Next.js</a>.
        </p>
      </section>
    </Layout>
  );
}
