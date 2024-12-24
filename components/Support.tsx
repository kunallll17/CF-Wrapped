export default function Support() {
  return (
    <div className="flex flex-col items-center space-y-4 p-6 bg-gray-800/50 rounded-lg">
      <h2 className="text-2xl font-bold text-white">Support the Project</h2>
      <p className="text-gray-300 text-center">
        If you find this tool helpful, consider supporting its development
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        {/* UPI Option */}
        <div className="flex items-center space-x-2 bg-gray-700/50 p-3 rounded-lg">
          <span className="text-gray-300">UPI:</span>
          <code className="bg-gray-800 px-2 py-1 rounded">kunallsharma.kl@oksbi</code>
        </div>

        {/* PayPal Option */}
        <a
          href="https://www.paypal.com/paypalme/kunallsharmaaa"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center px-4 py-2 bg-[#0070ba] hover:bg-[#005ea6] 
                   text-white rounded-lg transition-colors duration-200"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.067 8.478c.492.315.809.807.983 1.466.174.659.173 1.397-.003 2.212-.175.813-.474 1.527-.897 2.142a5.41 5.41 0 01-1.534 1.451c-.594.394-1.262.685-2.002.874a9.63 9.63 0 01-2.208.283h-3.11l-.834 3.976H7.149l.835-3.976H4.877l.835-3.976h2.107l1.67-7.953h6.513c1.143 0 2.107.174 2.893.524.786.349 1.331.91 1.634 1.681.303.772.302 1.663-.002 2.674-.305 1.012-.903 1.878-1.794 2.601zm-4.565-3.001c-.19.893-.474 1.634-.851 2.225-.377.591-.851 1.026-1.422 1.304-.571.278-1.224.417-1.958.417H9.504l1.67-7.953h1.767c.995 0 1.803.167 2.424.502.621.335 1.027.873 1.217 1.613.19.74.19 1.595 0 2.566z"/>
          </svg>
          Donate with PayPal
        </a>
      </div>

      <p className="text-sm text-gray-400 mt-4">
        Your support helps maintain and improve CF Wrapped!
      </p>
    </div>
  );
} 