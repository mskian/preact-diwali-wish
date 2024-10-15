import { useEffect, useState } from 'preact/hooks';
import slugify from 'slugify';
import DiwaliRocket from '../components/DiwaliRocket';

const Greeting = () => {
  const [name, setName] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(true);

  const validateName = (name: string): boolean => {
    const sanitized = name.trim();
    if (sanitized === '') {
      setError('Name cannot be empty.');
      return false;
    }
    if (sanitized.length === 1) {
      setError('Name must be at least 2 characters.');
      return false;
    }
    if (sanitized.length < 2 || sanitized.length > 36) {
      setError('Name must be at least 2 characters and cannot exceed 36 characters.');
      return false;
    }

    return true;
  };

  const sanitizeInput = (input: string): string => {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
  };

  const handleInputChange = (e: Event) => {
    const value = (e.target as HTMLInputElement).value;
    setName(value);
    setError(null);
  };

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    if (validateName(name)) {
      const sanitized = sanitizeInput(name);
      const slug = slugify(sanitized, { replacement: '-', remove: /[*+~.()'"!:@]/g, lower: false, strict: false });
      window.location.href = `/${slug}`;
    }
  };

  const imageUrl = 'https://img.sanweb.info/dw/dw?name=Your-Name';

  useEffect(() => {
    const timer = setTimeout(() => {
      setImageLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, [imageUrl]);

  const preloadImage = new Image();
  preloadImage.src = imageUrl;
  preloadImage.onload = () => setImageLoading(false);

  return (
    <div class="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-yellow-500 via-white to-rose-600">
      <div class="flex flex-col items-center justify-center max-w-md w-full p-6">
      <br />
      <DiwaliRocket />
      <br />
      <br />
      {imageLoading ? (
              <div class="flex items-center justify-center mb-8">
                <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-800"></div>
                <span class="ml-4">Image...</span>
              </div>
            ) : (
            <><img
                    src={imageUrl}
                    alt="Happy Diwali Wishes"
                    width="1080"
                    height="1080"
                    class="shadow-lg mb-5"
                    loading="lazy"
                    style={imageLoading ? { display: 'none' } : {}} />
                    </>
            )}
        <div class="bg-gradient-to-r from-white via-gray-100 to-gray-200 p-6 m-4 rounded-lg shadow-lg w-full text-center">
          <br />
          <h2 class="text-2xl font-bold text-gray-800 mb-4">Happy Diwali Greeting ✨</h2>
          <p class="text-lg text-gray-700 mb-6">Enter your name to receive a personalized greeting</p>
          <form onSubmit={handleSubmit} class="bg-gradient-to-r from-purple-500 to-rose-800 text-white p-8 rounded-lg shadow-md w-full">
            <div class="mb-6">
              <input
                type="text"
                id="name"
                value={name}
                onInput={handleInputChange}
                class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-yellow-100 text-rose-900"
                placeholder="Enter your name here"
                autocomplete='off'
              />
              {error && <p class="text-yellow-300 text-base italic mt-2">{error}</p>}
            </div>
            <button
              type="submit"
              class="w-full py-3 bg-gradient-to-r from-rose-400 to-purple-500 text-white font-semibold rounded-lg shadow-md transition-colors"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Greeting;
