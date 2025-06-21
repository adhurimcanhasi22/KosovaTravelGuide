import Head from 'next/head';
import Link from 'next/link';

const TermsOfService = () => {
  return (
    <>
      <Head>
        <title>Terms of Service | Kosovo Travel Guide</title>
        <meta
          name="description"
          content="Our Terms of Service govern your use of the Kosovo Travel Guide website. Please read these terms carefully."
        />
      </Head>
      <div className="container-custom py-16 mt-[6rem]">
        <h1 className="text-3xl font-bold text-[var(--enterprise-gray)] mb-8">
          Terms of Service
        </h1>

        <p className="text-gray-700 mb-4">
          Please read these Terms of Service carefully before using the Kosovo
          Travel Guide website (the "Site"). By accessing or using the Site, you
          agree to be bound by these terms. If you do not agree to all of these
          terms, then you may not access or use the Site.
        </p>

        <h2 className="text-xl font-semibold text-[var(--enterprise-blue)] mb-4">
          1. Acceptance of Terms
        </h2>
        <p className="text-gray-700 mb-4">
          These Terms of Service constitute a legally binding agreement between
          you and Kosovo Travel Guide (referred to as "we," "us," or "our")
          regarding your use of the Site.
        </p>

        <h2 className="text-xl font-semibold text-[var(--enterprise-blue)] mb-4">
          2. Use of the Site
        </h2>
        <p className="text-gray-700 mb-2">
          You agree to use the Site only for lawful purposes and in a manner
          that does not infringe the rights of, restrict, or inhibit anyone
          else's use and enjoyment of the Site.
        </p>
        <p className="text-gray-700 mb-4">
          You are responsible for ensuring that all information you provide to
          the Site is accurate, complete, and current.
        </p>

        <h2 className="text-xl font-semibold text-[var(--enterprise-blue)] mb-4">
          3. Intellectual Property
        </h2>
        <p className="text-gray-700 mb-4">
          The content, design, graphics, and other materials on the Site are
          protected by copyright and other intellectual property laws. You may
          not reproduce, modify, distribute, or otherwise use any content from
          the Site without our prior written consent.
        </p>

        <h2 className="text-xl font-semibold text-[var(--enterprise-blue)] mb-4">
          4. Disclaimer of Warranties
        </h2>
        <p className="text-gray-700 mb-4">
          The Site is provided on an "as is" and "as available" basis without
          any warranties of any kind, express or implied, including but not
          limited to warranties of merchantability, fitness for a particular
          purpose, and non-infringement. We do not warrant that the Site will be
          uninterrupted, error-free, or free of viruses or other harmful
          components.
        </p>

        <h2 className="text-xl font-semibold text-[var(--enterprise-blue)] mb-4">
          5. Limitation of Liability
        </h2>
        <p className="text-gray-700 mb-4">
          To the maximum extent permitted by applicable law, Kosovo Travel Guide
          shall not be liable for any indirect, incidental, special,
          consequential, or punitive damages arising out of or relating to your
          use of or inability to use the Site.
        </p>

        <h2 className="text-xl font-semibold text-[var(--enterprise-blue)] mb-4">
          6. Indemnification
        </h2>
        <p className="text-gray-700 mb-4">
          You agree to indemnify and hold harmless Kosovo Travel Guide and its
          affiliates, officers, directors, employees, and agents from and
          against any and all claims, liabilities, damages, losses, costs,
          expenses, or fees (including reasonable attorneys' fees) arising out
          of or relating to your breach of these Terms of Service or your use of
          the Site.
        </p>

        <h2 className="text-xl font-semibold text-[var(--enterprise-blue)] mb-4">
          7. Governing Law
        </h2>
        <p className="text-gray-700 mb-4">
          These Terms of Service shall be governed by and construed in
          accordance with the laws of Albania, without regard to its conflict of
          law principles.
        </p>

        <h2 className="text-xl font-semibold text-[var(--enterprise-blue)] mb-4">
          8. Changes to These Terms
        </h2>
        <p className="text-gray-700 mb-4">
          We may update these Terms of Service from time to time. We will post
          any changes on this page, and the revised terms will be effective upon
          posting. Your continued use of the Site after the posting of any
          changes constitutes your acceptance of the revised terms.
        </p>

        <h2 className="text-xl font-semibold text-[var(--enterprise-blue)] mb-4">
          9. Contact Us
        </h2>
        <p className="text-gray-700">
          If you have any questions about these Terms of Service, please contact
          us at{' '}
          <a
            href="mailto:kosovatravelguide@gmail.com"
            className="text-[var(--enterprise-skyblue)] hover:underline"
          >
            kosovatravelguide@gmail.com
          </a>
        </p>

        <div className="mt-8 text-center">
          <Link href="/">
            {' '}
            <i className="fas fa-arrow-left mr-1 text-[var(--enterprise-yellow)] hover:text-[var(--enterprise-lightyellow)]"></i>{' '}
          </Link>

          <Link
            href="/"
            className="mr-4 font-medium text-lg text-[var(--enterprise-blue)] hover:text-[var(--enterprise-skyblue)] transition-colors duration-200"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </>
  );
};

export default TermsOfService;

