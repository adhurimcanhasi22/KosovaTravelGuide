// app/verified-success/page.js
export default function VerifiedSuccess() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="text-center p-8 bg-white rounded-lg shadow-md">
        <div className="text-6xl text-green-500 mb-4">✓</div>
        <h1 className="text-2xl font-bold mb-2">
          Email Verified Successfully!
        </h1>
        <p>You can now log in to your account</p>
        <a
          href="https://kosovatravelguide.vercel.app/auth/login"
          className="inline-block mt-10 px-6 py-3 bg-[var(--enterprise-lightblue)] text-white font-medium rounded-lg hover:bg-[var(--enterprise-skyblue)] transition-colors shadow-md hover:shadow-lg"
        >
          Continue to Login
        </a>
      </div>
    </div>
  );
}
