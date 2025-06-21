import Head from 'next/head';
import Link from 'next/link';

const PrivacyPolicy = () => {
  return (
    <>
      <Head>
        <title>Privacy Policy | Kosovo Travel Guide</title>
        <meta
          name="description"
          content="Our Privacy Policy explains how we collect, use, and protect your personal information when you use the Kosovo Travel Guide website."
        />
      </Head>
      <div className="container-custom py-16 mt-[6rem]">
        <h1 className="text-3xl font-bold text-[var(--enterprise-gray)] mb-8">
          Privacy Policy
        </h1>

        <p className="text-gray-700 mb-4">
          Your privacy is important to us. This Privacy Policy outlines how
          Kosovo Travel Guide (referred to as "we," "us," or "our") collects,
          uses, and safeguards your personal information when you visit our
          website (the "Site"). By using the Site, you consent to the practices
          described in this policy.
        </p>

        <h2 className="text-xl font-semibold text-[var(--enterprise-blue)] mb-4">
          1. Information We Collect
        </h2>
        <p className="text-gray-700 mb-2">
          We may collect the following types of information:
        </p>
        <ul className="list-disc list-inside text-gray-700 mb-4">
          <li>
            **Personal Information:** This includes your name, email address,
            and any other information you voluntarily provide when you contact
            us, subscribe to our newsletter, or create an account (if
            applicable).
          </li>
          <li>
            **Usage Data:** We may collect information about how you interact
            with our Site, such as the pages you visit, the links you click, the
            time you spend on the Site, and other usage statistics.
          </li>
          <li>
            **Technical Data:** This includes your IP address, browser type,
            operating system, device information, and other technical details
            collected automatically.
          </li>
          <li>
            **Cookies and Similar Technologies:** We may use cookies and similar
            tracking technologies to enhance your browsing experience, analyze
            Site traffic, and personalize content. You can manage your cookie
            preferences through your browser settings.
          </li>
        </ul>

        <h2 className="text-xl font-semibold text-[var(--enterprise-blue)] mb-4">
          2. How We Use Your Information
        </h2>
        <p className="text-gray-700 mb-2">
          We may use your information for the following purposes:
        </p>
        <ul className="list-disc list-inside text-gray-700 mb-4">
          <li>To provide and maintain the Site.</li>
          <li>To personalize your experience on the Site.</li>
          <li>
            To communicate with you, including responding to your inquiries.
          </li>
          <li>
            To send you newsletters and promotional materials (if you
            subscribe).
          </li>
          <li>To analyze Site usage and improve our services.</li>
          <li>
            To detect, prevent, and address technical issues and security
            breaches.
          </li>
        </ul>

        <h2 className="text-xl font-semibold text-[var(--enterprise-blue)] mb-4">
          3. Sharing Your Information
        </h2>
        <p className="text-gray-700 mb-2">
          We may share your information with third parties in the following
          circumstances:
        </p>
        <ul className="list-disc list-inside text-gray-700 mb-4">
          <li>
            With service providers who assist us in operating the Site and
            providing our services (e.g., hosting, analytics).
          </li>
          <li>
            To comply with legal obligations or respond to lawful requests.
          </li>
          <li>To protect our rights and the rights of our users.</li>
          <li>
            In connection with a merger, acquisition, or sale of all or a
            portion of our assets (in which case your information may be
            transferred).
          </li>
        </ul>

        <h2 className="text-xl font-semibold text-[var(--enterprise-blue)] mb-4">
          4. Your Rights
        </h2>
        <p className="text-gray-700 mb-2">
          Depending on your location, you may have certain rights regarding your
          personal information, such as the right to access, correct, delete, or
          object to the processing of your data. Please contact us if you wish
          to exercise these rights.
        </p>

        <h2 className="text-xl font-semibold text-[var(--enterprise-blue)] mb-4">
          5. Data Security
        </h2>
        <p className="text-gray-700 mb-4">
          We take reasonable measures to protect your personal information from
          unauthorized access, use, or disclosure. However, no method of
          transmission over the internet or electronic storage is completely
          secure, and we cannot guarantee absolute security.
        </p>

        <h2 className="text-xl font-semibold text-[var(--enterprise-blue)] mb-4">
          6. Links to Other Websites
        </h2>
        <p className="text-gray-700 mb-4">
          Our Site may contain links to third-party websites. We are not
          responsible for the privacy practices or content of these websites. We
          encourage you to review the privacy policies of any third-party sites
          you visit.
        </p>

        <h2 className="text-xl font-semibold text-[var(--enterprise-blue)] mb-4">
          7. Changes to This Privacy Policy
        </h2>
        <p className="text-gray-700 mb-4">
          We may update this Privacy Policy from time to time. We will post any
          changes on this page, and the revised policy will be effective upon
          posting. We encourage you to review this policy periodically.
        </p>

        <h2 className="text-xl font-semibold text-[var(--enterprise-blue)] mb-4">
          8. Contact Us
        </h2>
        <p className="text-gray-700">
          If you have any questions or concerns about this Privacy Policy,
          please contact us at{' '}
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

export default PrivacyPolicy;

