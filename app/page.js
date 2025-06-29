'use client'
import React, { useState, useEffect } from 'react';

// --- Dummy Data (simulating lib/data.js) ---
let uniqueIdCounter = 0;
const generateUniqueId = () => `id-${uniqueIdCounter++}`;

const dummyArtists = [
  {
    id: generateUniqueId(),
    name: "Melody Strings",
    category: "Singers",
    priceRange: "$1000 - $2000",
    location: "Mumbai",
    bio: "A soulful singer known for mesmerizing audiences with acoustic performances and captivating stage presence. Specializes in pop, classical, and fusion genres.",
    imageUrl: "https://placehold.co/400x300/F0F8FF/000?text=Melody+Strings"
  },
  {
    id: generateUniqueId(),
    name: "Rhythm Squad",
    category: "Dancers",
    priceRange: "$2000 - $3000", // Fixed: Corrected string literal for priceRange
    location: "Delhi",
    bio: "An energetic dance group specializing in contemporary and Bollywood styles, bringing dynamic performances to any event. Their synchronized moves and vibrant costumes leave audiences in awe.",
    imageUrl: "https://placehold.co/400x300/F5FFFA/000?text=Rhythm+Squad"
  },
  {
    id: generateUniqueId(),
    name: "Eloquent Orators",
    category: "Speakers",
    priceRange: "$500 - $1500",
    location: "Bangalore",
    bio: "Motivational speakers and corporate trainers who deliver impactful sessions designed to inspire and educate. They cover topics from leadership to personal development.",
    imageUrl: "https://placehold.co/400x300/F0FFF0/000?text=Eloquent+Orators"
  },
  {
    id: generateUniqueId(),
    name: "Beat Blasters",
    category: "DJs",
    priceRange: "$1500 - $2500",
    location: "Chennai",
    bio: "Dynamic DJs spinning tracks for all kinds of events, from high-energy parties to grand festivals. Their versatile music selection ensures a memorable experience for everyone.",
    imageUrl: "https://placehold.co/400x300/FFF0F5/000?text=Beat+Blasters"
  },
  {
    id: generateUniqueId(),
    name: "Classical Harmony",
    category: "Singers",
    priceRange: "$500 - $1500",
    location: "Kolkata",
    bio: "A classical Indian vocalist with a captivating voice, performing traditional ragas and devotional music. Her performances evoke deep emotion and tranquility.",
    imageUrl: "https://placehold.co/400x300/FFFACD/000?text=Classical+Harmony"
  },
  {
    id: generateUniqueId(),
    name: "Fusion Steps",
    category: "Dancers",
    priceRange: "$1000 - $2000",
    location: "Hyderabad",
    bio: "A solo dancer showcasing a unique blend of traditional and modern dance forms. Their innovative choreography and expressive movements create stunning visual narratives.",
    imageUrl: "https://placehold.co/400x300/E6E6FA/000?text=Fusion+Steps"
  }
];

// --- Validation Schema (simulating lib/schemas.js) ---
// Simplified Yup-like schema for demonstration
const yup = {
  string: () => {
    const schema = { _type: 'string', _required: false, _min: 0, _message: '' };
    schema.required = (message) => {
      schema._required = true;
      schema._message = message;
      return schema; // Return schema for chaining
    };
    schema.min = (len, message) => {
      schema._min = len;
      if (message) schema._message = message; // Update message if provided
      return schema; // Return schema for chaining
    };
    return schema;
  },
  array: () => {
    const schema = { _type: 'array', _required: false, _min: 0, _message: '' };
    schema.required = (message) => {
      schema._required = true;
      schema._message = message;
      return schema; // Return schema for chaining
    };
    schema.min = (len, message) => {
      schema._min = len;
      if (message) schema._message = message; // Update message if provided
      return schema; // Return schema for chaining
    };
    return schema;
  },
  object: () => ({
    shape: (fields) => ({
      _type: 'object',
      _fields: fields,
      validateSync: (data, options) => {
        const errors = { inner: [] };
        for (const key in fields) {
          const fieldSchema = fields[key];
          const value = data[key];

          if (fieldSchema._required && (value === undefined || value === null || (typeof value === 'string' && value.trim() === '') || (Array.isArray(value) && value.length === 0))) {
            errors.inner.push({ path: key, message: fieldSchema._message || `${key} is required.` });
          }

          if (fieldSchema._type === 'string' && fieldSchema._min && typeof value === 'string' && value.length < fieldSchema._min) {
            errors.inner.push({ path: key, message: fieldSchema._message || `${key} must be at least ${fieldSchema._min} characters.` });
          }
          if (fieldSchema._type === 'array' && fieldSchema._min && Array.isArray(value) && value.length < fieldSchema._min) {
            errors.inner.push({ path: key, message: fieldSchema._message || `${key} must have at least ${fieldSchema._min} items.` });
          }
        }
        if (errors.inner.length > 0) {
          throw errors;
        }
        return data;
      },
      validateAt: (path, data, options) => {
        const errors = { inner: [] };
        const fieldSchema = fields[path];
        const value = data[path];

        if (fieldSchema._required && (value === undefined || value === null || (typeof value === 'string' && value.trim() === '') || (Array.isArray(value) && value.length === 0))) {
          errors.inner.push({ path: path, message: fieldSchema._message || `${path} is required.` });
        }

        if (fieldSchema._type === 'string' && fieldSchema._min && typeof value === 'string' && value.length < fieldSchema._min) {
          errors.inner.push({ path: path, message: fieldSchema._message || `${path} must be at least ${fieldSchema._min} characters.` });
        }
        if (fieldSchema._type === 'array' && fieldSchema._min && Array.isArray(value) && value.length < fieldSchema._min) {
          errors.inner.push({ path: path, message: fieldSchema._message || `${path} must have at least ${fieldSchema._min} items.` });
        }

        if (errors.inner.length > 0) {
          throw errors;
        }
        return { [path]: value };
      }
    }),
  }),
};

const onboardingFormSchema = yup.object().shape({
  name: yup.string().required('Artist Name is required.'),
  bio: yup.string().required('Bio is required.').min(50, 'Bio must be at least 50 characters.'),
  category: yup.array().min(1, 'At least one category must be selected.').required('Category is required.'),
  languagesSpoken: yup.array().min(1, 'At least one language must be selected.').required('Languages Spoken are required.'),
  feeRange: yup.string().required('Fee Range is required.'),
  location: yup.string().required('Location is required.'),
});

// --- Simulated ShadCN UI Components (components/ui/) ---

function Button({ className, variant, size, ...props }) {
  const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

  const variantClasses = {
    default: "bg-indigo-600 text-white hover:bg-indigo-700",
    outline: "border border-input bg-background hover:bg-gray-100 hover:text-accent-foreground",
    ghost: "hover:bg-gray-100 hover:text-accent-foreground",
  };

  const sizeClasses = {
    default: "h-10 px-4 py-2",
    sm: "h-9 px-3",
    lg: "h-11 px-8",
  };

  const finalClasses = `${baseClasses} ${variantClasses[variant || 'default']} ${sizeClasses[size || 'default']} ${className || ''}`;

  return <button className={finalClasses} {...props} />;
}

// Fixed: Ensured onChange passes e.target.value
function Input({ className, type = 'text', onChange, ...props }) {
  const classes = "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";
  return (
    <input
      type={type}
      className={`${classes} ${className || ''} bg-gray-100`}
      onChange={e => onChange && onChange(e.target.value)} // Normalize event to value
      {...props}
    />
  );
}

function Label({ className, ...props }) {
  const classes = "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70";
  return (
    <label className={`${classes} ${className || ''}`} {...props} />
  );
}

function Select({ children, className, onValueChange, ...props }) {
  // onValueChange is a prop often used by ShadCN select, simulate it
  const handleChange = (e) => {
    if (onValueChange) {
      onValueChange(e.target.value);
    }
    if (props.onChange) { // Ensure original onChange works
      props.onChange(e);
    }
  };

  const classes = "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";
  return (
    // Only use 'value' for controlled component. 'defaultValue' is for uncontrolled.
    <select className={`${classes} ${className || ''} bg-gray-100`} onChange={handleChange} {...props}>
      {children}
    </select>
  );
}

function SelectContent({ children }) {
  return <>{children}</>;
}

function SelectItem({ value, children }) {
  return <option value={value}>{children}</option>;
}

function Checkbox({ className, onCheckedChange, ...props }) { // Accept onCheckedChange
  const classes = "h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-indigo-600 data-[state=checked]:text-primary-foreground";
  return (
    <input
      type="checkbox"
      className={`${classes} ${className || ''}`}
      onChange={(e) => onCheckedChange && onCheckedChange(e.target.checked)} // Map to onChange
      {...props}
    />
  );
}

// Simulated ShadCN Dialog
function Dialog({ open, onOpenChange, children }) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={() => onOpenChange(false)} // Close when clicking outside
    >
      <div
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-auto relative"
        onClick={(e) => e.stopPropagation()} // Prevent click from bubbling to backdrop
      >
        {children}
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          onClick={() => onOpenChange(false)}
        >
          ✕
        </button>
      </div>
    </div>
  );
}

function DialogContent({ children }) {
  return <div>{children}</div>;
}

function DialogHeader({ children }) {
  return <div className="text-center sm:text-left mb-4">{children}</div>;
}

function DialogTitle({ children }) {
  return <h3 className="text-lg font-semibold text-gray-900">{children}</h3>;
}

function DialogDescription({ children }) {
  return <p className="text-sm text-gray-500">{children}</p>;
}

// --- Simulated react-hook-form and resolvers ---

// Moved Controller definition to top level
const Controller = ({ control, name, render, formState }) => { // Accept formState as a direct prop
  const value = control._formValues[name];
  return render({
    field: {
      name,
      value,
      onChange: (val) => control.setValue(name, val),
      onBlur: () => control.trigger(name),
    },
    formState: formState, // Pass the formState prop directly
  });
};


const useForm = (options) => {
  const [data, setData] = useState(options.defaultValues || {});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const watch = (name) => data[name];

  const setValue = (name, value, { shouldValidate = false } = {}) => {
    setData(prev => ({ ...prev, [name]: value }));
    if (shouldValidate) {
      validateField(name, value);
    }
  };

  // Fixed: Updated validateField to use resolver correctly
  const validateField = async (name, value) => {
    if (!options.resolver) return;
    const currentData = { ...data, [name]: value }; // Create temporary data for validation
    const validationResult = options.resolver(currentData);

    const fieldError = validationResult.errors[name];

    if (fieldError) {
      setErrors(prev => ({ ...prev, [name]: fieldError }));
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };


  // Fixed: Updated validateAll to use resolver correctly
  const validateAll = async () => {
    if (!options.resolver) return {};
    const validationResult = options.resolver(data); // Call the resolver with current data

    if (Object.keys(validationResult.errors).length > 0) {
      setErrors(validationResult.errors);
      return validationResult.errors;
    } else {
      setErrors({});
      return {};
    }
  };

  const handleSubmit = (onSubmit) => async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const validationErrors = await validateAll();
    if (Object.keys(validationErrors).length === 0) {
      await onSubmit(data);
    }
    setIsSubmitting(false);
  };

  const reset = () => {
    setData(options.defaultValues || {});
    setErrors({});
    setIsSubmitting(false);
  };

  const trigger = async (name) => {
    await validateField(name, data[name]);
  };

  return {
    control: {
      _formValues: data, // For controller to read
      setValue: setValue, // Pass setValue to control for direct updates
      trigger: trigger // Pass trigger to control for validation on demand
    },
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting }, // Include formState here
    reset,
    trigger,
  };
};

const yupResolver = (schema) => (values) => {
  try {
    schema.validateSync(values, { abortEarly: false });
    return {
      values,
      errors: {},
    };
  } catch (errors) {
    // This 'errors' object from yup should have an .inner property
    return {
      values: {},
      errors: errors.inner.reduce(
        (allErrors, currentError) => ({
          ...allErrors,
          [currentError.path]: {
            type: currentError.type ?? currentError.name,
            message: currentError.message,
          },
        }),
        {}
      ),
    };
  }
};

// --- Form Components (simulating components/ui/form.jsx) ---
function Form({ children, ...props }) {
  // This Form component will no longer render an actual <form> tag.
  // It acts as a wrapper for form fields and potentially context.
  return <>{children}</>;
}

function FormField({ control, name, render, formState }) { // Accept formState prop
  // Pass control and formState to the Controller
  return <Controller control={control} name={name} render={render} formState={formState} />;
}

function FormItem({ children, className }) {
  return <div className={`space-y-2 ${className || ''}`}>{children}</div>;
}

function FormLabel({ children, ...props }) {
  return <Label {...props}>{children}</Label>;
}

function FormControl({ children }) {
  return <>{children}</>;
}

function FormMessage({ children }) {
  // Children will directly be the error message string or undefined
  return children ? <p className="text-sm font-medium text-red-500">{children}</p> : null;
}


// --- Component: ArtistCard (simulating components/ArtistCard.jsx) ---
function ArtistCard({ artist }) {
  const [eventSuitability, setEventSuitability] = useState('');
  const [loadingSuitability, setLoadingSuitability] = useState(false);
  const [suitabilityError, setSuitabilityError] = useState('');
  const [showSuitabilityDialog, setShowSuitabilityDialog] = useState(false);

  /**
   * Fetches event suitability suggestions from the Gemini API.
   */
  const getEventSuitability = async () => {
    setLoadingSuitability(true);
    setSuitabilityError('');
    setEventSuitability('');

    const prompt = `Given the following artist details, suggest 3-5 types of events they would be ideally suited for, and a short, catchy tagline for an event featuring them. Format the response clearly with bullet points for events and a separate line for the tagline.
    Artist Name: ${artist.name}
    Category: ${artist.category}
    Bio: ${artist.bio}`;

    let chatHistory = [];
    chatHistory.push({ role: "user", parts: [{ text: prompt }] });
    const payload = { contents: chatHistory };
    const apiKey = ""; // Leave as-is, Canvas will provide in runtime.
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      console.log('Gemini API Response for Event Suitability:', result); // Added for debugging

      if (result.candidates && result.candidates.length > 0 &&
        result.candidates[0].content && result.candidates[0].content.parts &&
        result.candidates[0].content.parts.length > 0) {
        const text = result.candidates[0].content.parts[0].text;
        setEventSuitability(text);
        setShowSuitabilityDialog(true);
      } else {
        setSuitabilityError('Failed to get event suitability. Please try again.');
      }
    } catch (error) {
      console.error('Error fetching event suitability:', error);
      setSuitabilityError('An error occurred while fetching suitability. Please check console.');
    } finally {
      setLoadingSuitability(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transform transition duration-300 hover:scale-105">
      <img
        className="w-full h-48 object-cover"
        src={artist.imageUrl}
        alt={artist.name}
        onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/400x300/CCCCCC/FFFFFF?text=No+Image"; }}
      />
      <div className="p-6">
        <h3 className="font-semibold text-xl mb-2 text-gray-800">{artist.name}</h3>
        <p className="text-sm text-gray-600 mb-1">
          <span className="font-medium">Category:</span> {artist.category}
        </p>
        <p className="text-sm text-gray-600 mb-1">
          <span className="font-medium">Location:</span> {artist.location}
        </p>
        <p className="text-sm text-gray-600 mb-4">
          <span className="font-medium">Price Range:</span> {artist.priceRange}
        </p>
        <Button className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50">
          Ask for Quote
        </Button>
        <Button
          onClick={getEventSuitability}
          disabled={loadingSuitability}
          className="mt-2 w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
        >
          {loadingSuitability ? 'Suggesting...' : '✨Event Suitability'}
        </Button>
        {suitabilityError && <p className="text-red-500 text-xs mt-2">{suitabilityError}</p>}
      </div>

      <Dialog open={showSuitabilityDialog} onOpenChange={setShowSuitabilityDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Event Suitability for {artist.name}</DialogTitle>
            <DialogDescription>
              Here are some event ideas and a tagline generated by AI for this artist:
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-700 border border-gray-200 whitespace-pre-wrap">
            {eventSuitability}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// --- Component: Navbar (simulating components/Navbar.jsx) ---
function Navbar({ currentPage, setCurrentPage }) {
  // Simulated Link component for Next.js routing in components
  const Link = ({ href, children, className, onClick }) => {
    const handleClick = (e) => {
      e.preventDefault();
      if (onClick) onClick(href);
      // In a real Next.js app, you'd use useRouter or router.push
      // For this simulation, we update the current page state.
      setCurrentPage(href);
    };
    return <a href={href} className={className} onClick={handleClick}>{children}</a>;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-lg py-4 px-6 md:px-8 flex flex-col md:flex-row items-center justify-between">
      <div className="flex items-center mb-4 md:mb-0">
        <Link href="/" className="text-2xl font-bold text-indigo-600">
          Artistly.com
        </Link>
      </div>
      <ul className="flex flex-wrap justify-center md:flex-nowrap md:space-x-8 text-gray-700 font-medium">
        <li>
          <Link href="/" className={`hover:text-indigo-600 px-3 py-2 rounded-lg transition duration-200 ${currentPage === '/' ? 'text-indigo-600 bg-indigo-50' : ''
            }`}
          >
            Home
          </Link>
        </li>
        <li>
          <Link href="/artists" className={`hover:text-indigo-600 px-3 py-2 rounded-lg transition duration-200 ${currentPage === '/artists' ? 'text-indigo-600 bg-indigo-50' : ''
            }`}
          >
            Explore Artists
          </Link>
        </li>
        <li>
          <Link href="/onboard" className={`hover:text-indigo-600 px-3 py-2 rounded-lg transition duration-200 ${currentPage === '/onboard' ? 'text-indigo-600 bg-indigo-50' : ''
            }`}
          >
            Artist Onboarding
          </Link>
        </li>
      </ul>
    </nav>
  );
}


// --- Page: HomePage (simulating app/page.js) ---
function HomePage({ setCurrentPage }) {
  // Simulated Link component for Next.js routing within pages
  const Link = ({ href, children, className, onClick }) => {
    const handleClick = (e) => {
      e.preventDefault();
      if (onClick) onClick(href);
      setCurrentPage(href);
    };
    return <a href={href} className={className} onClick={handleClick}>{children}</a>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-8 pt-24 md:pt-32">
      {/* Hero Section */}
      <section className="text-center py-16 md:py-24 bg-white rounded-xl shadow-lg mb-12 max-w-4xl mx-auto">
        <h1 className="text-4xl md::text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
          Discover & Book Top Performing Artists
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Artistly.com connects Event Planners with Artist Managers seamlessly. Find the perfect talent for your next event.
        </p>
        <Link href="/artists" className="bg-indigo-600 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg hover:bg-indigo-700 transform hover:scale-105 transition duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-300">
          Explore Artists
        </Link>
      </section>

      {/* Artist Categories Section */}
      <section className="max-w-6xl mx-auto mb-12">
        <h2 className="text-3xl md::text-4xl font-bold text-center text-gray-800 mb-10">
          Browse by Category
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {['Singers', 'Dancers', 'Speakers', 'DJs'].map((category, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md p-6 text-center transform transition duration-300 hover:scale-105 hover:shadow-xl">
              <div className="text-indigo-600 text-5xl mb-4">
                {category === 'Singers' && '🎤'}
                {category === 'Dancers' && '💃'}
                {category === 'Speakers' && '🗣️'}
                {category === 'DJs' && '🎧'}
              </div>
              <h3 className="font-semibold text-lg text-gray-800">{category}</h3>
              <p className="text-gray-500 text-sm mt-2">Find {category.toLowerCase()} for your event.</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// --- Page: ArtistListingPage (simulating app/artists/page.js) ---
function ArtistListingPage() {
  const [filters, setFilters] = useState({
    category: 'All',
    location: '',
    priceRange: 'All',
  });
  const [filteredArtists, setFilteredArtists] = useState(dummyArtists);

  // Extract unique filter options
  const categories = ['All', ...new Set(dummyArtists.map(a => a.category))];
  const priceRanges = ['All', ...new Set(dummyArtists.map(a => a.priceRange))].sort(); // Sort for consistent order

  useEffect(() => {
    // Apply filters whenever filter state changes
    const applyFilters = () => {
      let tempArtists = dummyArtists;

      if (filters.category !== 'All') {
        tempArtists = tempArtists.filter(artist => artist.category === filters.category);
      }
      if (filters.location) {
        tempArtists = tempArtists.filter(artist =>
          artist.location.toLowerCase().includes(filters.location.toLowerCase())
        );
      }
      if (filters.priceRange !== 'All') {
        tempArtists = tempArtists.filter(artist => artist.priceRange === filters.priceRange);
      }
      setFilteredArtists(tempArtists);
    };

    applyFilters();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 pt-20 md:p-8 md:pt-24">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md::text-4xl font-bold text-gray-900 mb-8 text-center">
          Our Talented Artists
        </h1>

        {/* Filter Controls */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8 flex flex-col md:flex-row md:items-end gap-4">
          {/* Category Filter */}
          <div className="relative flex-1">
            <Label htmlFor="category">Category</Label>
            <Select
              id="category"
              name="category"
              value={filters.category}
              onValueChange={(val) => setFilters(prev => ({ ...prev, category: val }))}
              className="w-full"
            >
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Location Filter */}
          <div className="flex-1">
            <Label htmlFor="location">Location</Label>
            <Input
              type="text"
              id="location"
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
              placeholder="e.g., Mumbai"
            />
          </div>

          {/* Price Range Filter */}
          <div className="relative flex-1">
            <Label htmlFor="priceRange">Price Range</Label>
            <Select
              id="priceRange"
              name="priceRange"
              value={filters.priceRange}
              onValueChange={(val) => setFilters(prev => ({ ...prev, priceRange: val }))}
              className="w-full"
            >
              <SelectContent>
                {priceRanges.map((range) => (
                  <SelectItem key={range} value={range}>
                    {range}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Artist Grid */}
        {filteredArtists.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredArtists.map(artist => (
              <ArtistCard key={artist.id} artist={artist} />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-600 py-10">
            No artists found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
}

// --- Page: ArtistOnboardingForm (simulating app/onboard/page.js) ---
function ArtistOnboardingForm() {
  const categories = ['Singers', 'Dancers', 'Speakers', 'DJs', 'Musicians', 'Comedians'];
  const languages = ['English', 'Hindi', 'Punjabi', 'Bengali', 'Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Gujarati', 'Marathi'];
  const feeRanges = ['Below $500', '$500 - $1500', '$1500 - $2500', '$2500 - $5000', 'Above $5000'];

  const form = useForm({
    resolver: yupResolver(onboardingFormSchema),
    defaultValues: {
      name: '',
      bio: '',
      category: [],
      languagesSpoken: [],
      feeRange: '',
      location: '',
      profileImage: null, // File object, not part of yup schema directly
    },
  });

  const { control, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = form;
  const [submissionMessage, setSubmissionMessage] = useState('');
  const [loadingBioSuggestion, setLoadingBioSuggestion] = useState(false);
  const [bioSuggestionError, setBioSuggestionError] = useState('');

  const currentName = watch('name');
  const currentBio = watch('bio');
  const currentCategory = watch('category');
  const fileInputRef = React.useRef(null);
  /**
   * Handles form submission.
   * @param {object} data - The validated form data.
   */
  const onSubmit = async (data) => {
    setSubmissionMessage('');
    try {
      console.log('Form Data Submitted (attempting mock API call):', data); // Log data to console
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubmissionMessage('Artist details submitted successfully!');
      form.reset(); // Reset form after successful submission
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      console.log('Form Submission Successful and Reset.');
    } catch (error) {
      console.error('Submission error:', error);
      setSubmissionMessage('An error occurred during submission. Please try again.');
    }
  };

  /**
   * Generates a bio suggestion using the Gemini API based on current form data.
   */
  const suggestBio = async () => {
    setLoadingBioSuggestion(true);
    setBioSuggestionError('');

    if (!currentName && !currentBio && currentCategory.length === 0) {
      setBioSuggestionError('Please provide at least a name, category, or some bio text to get a suggestion.');
      setLoadingBioSuggestion(false);
      return;
    }

    const prompt = `Expand and refine the following artist bio. Make it engaging and suitable for a professional booking platform.
    The artist is named "${currentName || 'An artist'}".
    Their categories are: ${currentCategory.length > 0 ? currentCategory.join(', ') : 'Not specified'}.
    Original bio (if any): "${currentBio || 'No initial bio provided.'}"

    Please provide a concise, polished bio that highlights their strengths and appeals to event planners.`;

    let chatHistory = [];
    chatHistory.push({ role: "user", parts: [{ text: prompt }] });
    const payload = { contents: chatHistory };
    const apiKey = ""; // Leave as-is, Canvas will provide in runtime.
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      console.log('Gemini API Response for Bio Suggestion:', result); // Added for debugging

      if (result.candidates && result.candidates.length > 0 &&
        result.candidates[0].content && result.candidates[0].content.parts &&
        result.candidates[0].content.parts.length > 0) {
        const text = result.candidates[0].content.parts[0].text;
        setValue('bio', text, { shouldValidate: true }); // Update bio field and trigger validation
      } else {
        setBioSuggestionError('Failed to get bio suggestion. Please try again. Check console for details.');
      }
    } catch (error) {
      console.error('Error fetching bio suggestion:', error);
      setBioSuggestionError('An error occurred while fetching bio suggestion. Please check console.');
    } finally {
      setLoadingBioSuggestion(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4 pt-20 md:p-8 md:pt-24">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-6 md:p-8">
        <h1 className="text-3xl md::text-4xl font-bold text-gray-900 mb-8 text-center">
          Artist Onboarding Form
        </h1>
        {submissionMessage && (
          <div className={`p-4 mb-4 rounded-lg text-center ${submissionMessage.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {submissionMessage}
          </div>
        )}
        {/* The form tag now only takes standard HTML form attributes */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Section 1: Basic Details */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              Basic Details
            </h2>
            {/* Artist Name */}
            <FormField
              control={control}
              name="name"
              formState={{ errors }} // Pass errors explicitly
              render={({ field, formState: renderFormState }) => (
                <FormItem>
                  <FormLabel>Artist Name <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    {/* Ensure value is explicitly passed as field.value */}
                    <Input value={field.value || ''} onChange={field.onChange} onBlur={field.onBlur} placeholder="e.g., John Doe" />
                  </FormControl>
                  <FormMessage>{renderFormState.errors.name?.message}</FormMessage>
                </FormItem>
              )}
            />

            {/* Bio */}
            <FormField
              control={control}
              name="bio"
              formState={{ errors }} // Pass errors explicitly
              render={({ field, formState: renderFormState }) => (
                <FormItem className="mt-4">
                  <FormLabel>Bio <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <textarea
                      value={field.value || ''} // Explicitly set value and handle potential undefined
                      onChange={(e) => field.onChange(e.target.value)} // Fixed: Normalize event to value
                      onBlur={field.onBlur} // Explicitly set onBlur
                      rows="4"
                      className="w-full bg-gray-100 border border-gray-300 rounded-lg py-2 px-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Tell us about your artistic journey..."
                    ></textarea>
                  </FormControl>
                  <Button
                    type="button"
                    onClick={suggestBio}
                    disabled={loadingBioSuggestion}
                    className="mt-2 bg-pink-600 text-white py-2 px-4 rounded-lg text-sm hover:bg-pink-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50"
                  >
                    {loadingBioSuggestion ? 'Suggesting...' : '✨Suggest Bio'}
                  </Button>
                  {bioSuggestionError && <p className="text-red-500 text-xs mt-1">{bioSuggestionError}</p>}
                  <FormMessage>{renderFormState.errors.bio?.message}</FormMessage>
                </FormItem>
              )}
            />
          </div>

          {/* Section 2: Performance Details */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              Performance Details
            </h2>
            {/* Category (Multi-select dropdown with checkboxes) */}
            <FormField
              control={control}
              name="category"
              formState={{ errors }} // Pass errors explicitly
              render={({ field, formState: renderFormState }) => (
                <FormItem className="relative">
                  <FormLabel>Category <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <div>
                      {/* Simulate dropdown button with current values */}
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full text-left justify-between"
                        onClick={() => { /* In a real app, this would open the dropdown */ }}
                      >
                        {field.value?.length > 0
                          ? field.value.length === categories.length
                            ? "All Categories"
                            : field.value.join(', ')
                          : "Select Categories"}
                      </Button>
                      {/* Actual checkboxes visible directly for this simulation */}
                      <div className="mt-2 p-2 bg-gray-50 border border-gray-200 rounded-lg">
                        {categories.map((cat) => (
                          <Label key={cat} className="flex items-center px-3 py-2 cursor-pointer hover:bg-indigo-50 rounded-md">
                            <Checkbox
                              checked={field.value.includes(cat)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, cat])
                                  : field.onChange(field.value?.filter((value) => value !== cat));
                              }}
                              className="mr-2"
                            />
                            <span className="text-gray-800">{cat}</span>
                          </Label>
                        ))}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage>{renderFormState.errors.category?.message}</FormMessage>
                </FormItem>
              )}
            />

            {/* Languages Spoken (Multi-select with checkboxes) */}
            <FormField
              control={control}
              name="languagesSpoken"
              formState={{ errors }} // Pass errors explicitly
              render={({ field, formState: renderFormState }) => (
                <FormItem className="mt-4 relative">
                  <FormLabel>Languages Spoken <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <div>
                      {/* Simulate dropdown button with current values */}
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full text-left justify-between"
                        onClick={() => { /* In a real app, this would open the dropdown */ }}
                      >
                        {field.value?.length > 0
                          ? field.value.length === languages.length
                            ? "All Languages"
                            : field.value.join(', ')
                          : "Select Languages"}
                      </Button>
                      {/* Actual checkboxes visible directly for this simulation */}
                      <div className="mt-2 p-2 bg-gray-50 border border-gray-200 rounded-lg">
                        {languages.map((lang) => (
                          <Label key={lang} className="flex items-center px-3 py-2 cursor-pointer hover:bg-indigo-50 rounded-md">
                            <Checkbox
                              checked={field.value.includes(lang)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, lang])
                                  : field.onChange(field.value?.filter((value) => value !== lang));
                              }}
                              className="mr-2"
                            />
                            <span className="text-gray-800">{lang}</span>
                          </Label>
                        ))}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage>{renderFormState.errors.languagesSpoken?.message}</FormMessage>
                </FormItem>
              )}
            />

            {/* Fee Range */}
            <FormField
              control={control}
              name="feeRange"
              formState={{ errors }} // Pass errors explicitly
              render={({ field, formState: renderFormState }) => (
                <FormItem className="mt-4">
                  <FormLabel>Fee Range <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    {/* Ensure value is explicitly passed */}
                    <Select value={field.value || ''} onValueChange={field.onChange}>
                      <SelectContent>
                        <SelectItem value="">Select a fee range</SelectItem>
                        {feeRanges.map((range) => (
                          <SelectItem key={range} value={range}>{range}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage>{renderFormState.errors.feeRange?.message}</FormMessage>
                </FormItem>
              )}
            />

            {/* Location */}
            <FormField
              control={control}
              name="location"
              formState={{ errors }} // Pass errors explicitly
              render={({ field, formState: renderFormState }) => (
                <FormItem className="mt-4">
                  <FormLabel htmlFor="location">Location</FormLabel> {/* Corrected: Closing tag matches opening tag */}
                  <FormControl>
                    <Input value={field.value || ''} onChange={field.onChange} onBlur={field.onBlur} placeholder="e.g., Delhi" />
                  </FormControl>
                  <FormMessage>{renderFormState.errors.location?.message}</FormMessage>
                </FormItem>
              )}
            />




            {/* Profile Image Upload */}
            <FormField
              control={control}
              name="profileImage"
              formState={{ errors }}
              render={({ field: { onChange, value, ...field } }) => (
                <FormItem className="mt-4">
                  <FormLabel>Profile Image (Optional)</FormLabel>
                  <FormControl>
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={(e) => {
                        // Check if files exist before accessing
                        if (e.target.files && e.target.files.length > 0) {
                          onChange(e.target.files[0]);
                        } else {
                          onChange(null);
                        }
                      }}
                      className="w-full text-gray-800 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                      {...field}
                    />
                  </FormControl>
                  {errors.profileImage && (
                    <FormMessage>{errors.profileImage.message}</FormMessage>
                  )}
                </FormItem>
              )}
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg text-lg shadow-md hover:bg-indigo-700 transform hover:scale-105 transition duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-300"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Artist Profile'}
          </Button>
        </form>
      </div>
    </div>
  );
}


// --- Main App Component (simulating app/layout.js + page routing) ---
export default function App() {
  const [currentPage, setCurrentPage] = useState('/'); // Default to home page

  // Render the current page based on state
  const renderPage = () => {
    switch (currentPage) {
      case '/':
        return <HomePage setCurrentPage={setCurrentPage} />;
      case '/artists':
        return <ArtistListingPage />;
      case '/onboard':
        return <ArtistOnboardingForm />;
      default:
        return <HomePage setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div className="font-sans antialiased text-gray-900 bg-gray-50 overflow-x-hidden">
      {/* Tailwind CSS CDN and Google Font - Inter */}
      {/* These scripts/links are placed directly in the body for this environment
          to avoid React DOM nesting warnings with <head> tags.
          In a real Next.js app, these would be managed by app/layout.js or next/head. */}
      <script src="https://cdn.tailwindcss.com"></script>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      <style>{`
          body {
            font-family: 'Inter', sans-serif;
          }
        `}</style>
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="pt-16"> {/* Adjust padding based on Navbar height */}
        {renderPage()}
      </main>
    </div>
  );
}
