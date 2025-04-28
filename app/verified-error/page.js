// app/verified-error/page.js
export default function VerifiedError() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50">
      <div className="text-center p-8 bg-white rounded-lg shadow-md">
        <div className="text-6xl text-red-500 mb-4">✗</div>
        <h1 className="text-2xl font-bold mb-2">Verification Failed</h1>
        <p>The verification link is invalid or expired</p>
        <a
          href="/signup"
          className="mt-4 inline-block text-blue-600 hover:underline"
        >
          Try Again
        </a>
      </div>
    </div>
  );
}
