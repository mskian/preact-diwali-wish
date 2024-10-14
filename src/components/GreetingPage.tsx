import { JSX } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import DOMPurify from 'dompurify';
import slugify from 'slugify';
import DiwaliRocket from '../components/DiwaliRocket';

interface GreetingPageProps {
  name?: string;
}

const sanitizeName = (name: string) => {
  let cleanName = DOMPurify.sanitize(name).trim();
  cleanName = slugify(cleanName, {
    replacement: ' ',
    remove: /[*+~.()'"!:@]/g,
    lower: false,
    strict: false,
  });
  cleanName = cleanName.replace(/\++/g, ' ');
  cleanName = cleanName.replace(/\s+/g, ' ');
  cleanName = cleanName.replace(/%20+/g, ' ');
  cleanName = cleanName.replace(/-+/g, ' ');
  if (cleanName.length < 2 || cleanName.length > 36) {
    return 'Guest';
  }
  return cleanName;
};

const getFormattedTime = () => {
  const options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'Asia/Kolkata',
  };
  const formatter = new Intl.DateTimeFormat('en-IN', options);
  return formatter.format(new Date());
};

const Snackbar = ({ message, onClose }: { message: string; onClose: () => void }) => (
  <div class="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded-lg shadow-lg flex items-center space-x-4 max-w-72 w-full">
    <span class="flex-1">{message}</span>
    <button onClick={onClose} class="bg-red-500 text-white p-2 rounded-full hover:bg-red-600">
      &times;
    </button>
  </div>
);

const GreetingPage = (props: GreetingPageProps & JSX.IntrinsicElements['div']) => {
  const [loading, setLoading] = useState(true);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [toggleState, setToggleState] = useState(false);
  const [language, setLanguage] = useState('en');
  const { name } = props;
  const sanitizedName = sanitizeName(name || '');
  const currentTime = getFormattedTime();
  const currentUrl = window.location.href;

  useEffect(() => {
    const savedToggleState = localStorage.getItem('toggleState');
    if (savedToggleState !== null) {
      setToggleState(JSON.parse(savedToggleState));
    }

    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }

    setTimeout(() => {
      setLoading(false);
    }, 2000);

    const metaTitle = `${sanitizedName ? `${sanitizedName}` : ''} - Happy Diwali Greetings ✨`;
    const metaDescription = `Wishing you a Happy Diwali From ${sanitizedName ? `${sanitizedName}` : ''} - Check out your personalized greeting page.`;

    document.title = metaTitle;

    let metaDescriptionTag = document.querySelector('meta[name="description"]') as HTMLMetaElement;
    if (metaDescriptionTag) {
      metaDescriptionTag.content = metaDescription;
    } else {
      metaDescriptionTag = document.createElement('meta');
      metaDescriptionTag.name = 'description';
      metaDescriptionTag.content = metaDescription;
      document.head.appendChild(metaDescriptionTag);
    }

    let linkCanonicalTag = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (linkCanonicalTag) {
      linkCanonicalTag.href = currentUrl;
    } else {
      linkCanonicalTag = document.createElement('link');
      linkCanonicalTag.rel = 'canonical';
      linkCanonicalTag.href = currentUrl;
      document.head.appendChild(linkCanonicalTag);
    }

    return () => {
      document.title = 'Happy Diwali Greetings ✨';
      const metaDescriptionTag = document.querySelector('meta[name="description"]') as HTMLMetaElement;
      if (metaDescriptionTag) metaDescriptionTag.content = '';
      const linkCanonicalTag = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (linkCanonicalTag) linkCanonicalTag.href = '';
    };
  }, [sanitizedName, currentUrl]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentUrl)
      .then(() => setSnackbarMessage('URL copied'))
      .catch(() => setSnackbarMessage('Failed to copy URL.'));
  };

  const redirectToHome = () => {
    try {
      window.location.href = '/';
    } catch (error) {
      console.error('Error redirecting to home:', error);
      setSnackbarMessage('Failed to redirect. Please try again.');
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (snackbarMessage) {
      timer = setTimeout(() => {
        setSnackbarMessage(null);
      }, 2500);
    }
    return () => clearTimeout(timer);
  }, [snackbarMessage]);

  useEffect(() => {
    localStorage.setItem('toggleState', JSON.stringify(toggleState));
  }, [toggleState]);

  useEffect(() => {
    localStorage.setItem('selectedLanguage', language);
  }, [language]);

  const handleLanguageChange = (e: Event) => {
    const target = e.target as HTMLSelectElement;
    setLanguage(target.value);
  };

  const messages = {
    en: {
      greeting: `Happy Diwali Wishes ✨`,
      message1: `Wishing you a Diwali filled with happiness, prosperity, and bright moments. May this festival of lights bring joy to your heart and success to your life. Happy Diwali!`,
      message2: `May this Diwali bring lights of happiness, prosperity, and peace into your life! Wishing you a very Happy Diwali!`,
    },
    ta: {
      greeting: ` இனிய தீபாவளி நல்வாழ்த்துக்கள் ✨`,
      message1: `இந்த தீபவளி உங்கள் வாழ்க்கையில் சந்தோஷம், செல்வம், மற்றும் ஒளிமயமான தருணங்களை கொண்டு வரட்டும். ஒளிகளின் திருவிழா உங்கள் மனதில் மகிழ்ச்சியை, உங்கள் வாழ்வில் வெற்றியை ஏற்படுத்தட்டும். இனிய தீபாவளி நல்வாழ்த்துகள்!`,
      message2: `இந்நாளில் உங்கள் வாழ்க்கையில் ஒளி நிறைந்த செல்வம், சுகம், சமாதானம் நிலவட்டும்! இனிய தீபாவளி நல்வாழ்த்துகள்!`,
    },
    hi: {
      greeting: `दिवाली की हार्दिक शुभकामनाएँ ✨`,
      message1: `आपको और आपके परिवार को दीपावली की हार्दिक शुभकामनाएँ। यह दीपों का त्योहार आपके जीवन में सुख, शांति और समृद्धि लेकर आए। हैप्पी दिवाली!`,
      message2: `इस दिवाली, आपके जीवन में खुशियों के दीप जलते रहें और समृद्धि आपके घर का मेहमान बने! दीपावली की हार्दिक शुभकामनाएं!`,
    },
    te: {
      greeting: `దీపావళి శుభాకాంక్షలు ✨`,
      message1: `మీకు మరియు మీ కుటుంబానికి దీపావళి శుభాకాంక్షలు. ఈ దీపాల పండుగ మీ జీవితంలో ఆనందం, సంపద మరియు శాంతిని తీసుకురావాలని కోరుకుంటున్నాను. మీకు హ్యాపీ దీపావళి!`,
      message2: `ఈ దీపావళి మీరు మరియు మీ కుటుంబం కోసం సంతోషం, ధనం, ఆరోగ్యం మరియు శాంతి తెచ్చిపెడుతుంది! దీపావళి శుభాకాంక్షలు!`,
    },
    ml: {
      greeting: `ദീപാവലി ആശംസകൾ ✨`,
      message1: `നിങ്ങളും നിങ്ങളുടെ കുടുംബവും ഒരുപാട് സന്തോഷങ്ങളും സമൃദ്ധിയും നിറഞ്ഞ ദീപാവലി ആചരിക്കട്ടെ. ഈ ദീപങ്ങളുടെ ഉത്സവം നിങ്ങളുടെ ജീവിതം ഉജ്ജ്വലമാക്കട്ടെ. ഹാപ്പി ദീപാവലി!`,
      message2: `ഈ ദീപാവളി ദിനം നിങ്ങളുടെ ജീവിതത്തിൽ സമൃദ്ധിയും സുഖവും എപ്പോഴും നിറഞ്ഞിരിക്കട്ടെ! ഹാപ്പി ദീപാവലി ആശംസകൾ!`,
    },
    kn: {
      greeting: `ದೀಪಾವಳಿ ಹಾರ್ದಿಕ ಶುಭಾಶಯಗಳು ✨`,
      message1: `ನೀವು ಮತ್ತು ನಿಮ್ಮ ಕುಟುಂಬಕ್ಕೆ ದೀಪಾವಳಿ ಹಬ್ಬದ ಹಾರ್ದಿಕ ಶುಭಾಶಯಗಳು. ಈ ದೀಪಗಳ ಹಬ್ಬವು ನಿಮ್ಮ ಜೀವನದಲ್ಲಿ ಸಂತೋಷ, ಶಾಂತಿ, ಮತ್ತು ಸಮೃದ್ಧಿಯನ್ನು ತರುತ್ತಿರಲಿ. ಹ್ಯಾಪಿ ದೀಪಾವಳಿ!`,
      message2: `ಈ ದೀಪಾವಳಿ ನಿಮಗೆ ಆಯುಷ್ಯ, ಸಂಪತ್ತು, ಸಂತೋಷ ಮತ್ತು ಶಾಂತಿ ತಂದುಕೊಡಲಿ! ದೀಪಾವಳಿ ಹಬ್ಬದ ಶುಭಾಶಯಗಳು!`,
    },
  };

  return (
    <div class="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-yellow-500 via-white to-rose-600 p-4">
      {loading ? (
        <div class="flex items-center justify-center mb-8">
          <div class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-800"></div>
        </div>
      ) : (
        <>
          <div class="chat-container">
          <div class="flex flex-col items-center space-y-3">
            <label for="language-select" class="text-black font-bold">
              Choose Language
            </label>
            <select
              id="language-select"
              onChange={handleLanguageChange}
              value={language}
              class="p-2 rounded-lg shadow-lg text-black border-2 border-black focus:outline-none focus:ring focus:border-blue-300 transition duration-200"
            >
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="ta">Tamil</option>
              <option value="te">Telugu</option>
              <option value="ml">Malayalam</option>
              <option value="kn">Kannada</option>
            </select>
          </div>
          <br />
          <br />
          <DiwaliRocket />
          <br />
            <div class="chat-box">
              <div class="chat-bubble right shadow-md focus:outline-none transition-transform duration-200 transform hover:scale-105">
                {sanitizedName ? `${sanitizedName} ✨` : '✨ Your Name Here'}
                <div class="chat-time">{currentTime}</div>
              </div>
              <div class="chat-bubble left shadow-md focus:outline-none transition-transform duration-200 transform hover:scale-105 text-base">
                {messages[language].greeting}
                <div class="chat-time">{currentTime}</div>
              </div>
              <div class="chat-bubble right shadow-md focus:outline-none transition-transform duration-200 transform hover:scale-105 text-base">
                {messages[language].message1}
                <div class="chat-time">{currentTime}</div>
              </div>
              <div class="chat-bubble left shadow-md focus:outline-none transition-transform duration-200 transform hover:scale-105 text-base">
                {messages[language].message2}
                <div class="chat-time">{currentTime}</div>
              </div>
            </div>
          </div>
          <br />
          <div class="mb-4">
            <label class="flex items-center cursor-pointer">
              <span class="mr-2 text-lg">{toggleState ? 'Hide Options' : 'Show Options'}</span>
              <div class="relative">
                <input type="checkbox" checked={toggleState} onChange={() => setToggleState(!toggleState)} class="sr-only" />
                <div class={`block w-16 h-8 rounded-full ${toggleState ? 'bg-green-500' : 'bg-purple-500'}`}></div>
                <div class={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${toggleState ? 'transform translate-x-8' : ''}`}></div>
              </div>
            </label>
          </div>
          {toggleState && (
            <div class="bg-white p-6 rounded-lg shadow-md mb-10 w-full max-w-md flex justify-between items-center space-x-4">
              <button onClick={copyToClipboard} class="bg-gradient-to-r from-blue-400 to-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:from-blue-500 hover:to-blue-700">
                Copy URL
              </button>
              <button onClick={redirectToHome} class="bg-gradient-to-r from-green-400 to-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:from-green-500 hover:to-green-700">
                Create
              </button>
            </div>
          )}
        </>
      )}
      {snackbarMessage && (
        <Snackbar
          message={snackbarMessage}
          onClose={() => setSnackbarMessage(null)}
        />
      )}
    </div>
  );
};

export default GreetingPage;
