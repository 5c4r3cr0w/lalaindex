import { initializeApp } from "firebase/app"
import { getFirestore, collection, addDoc } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyBiVlCLeQf-iDM-NO5NI7KHWKiGvQbIKWM",
  authDomain: "lalaindex-c561b.firebaseapp.com",
  projectId: "lalaindex-c561b",
  storageBucket: "lalaindex-c561b.firebasestorage.app",
  messagingSenderId: "172749117063",
  appId: "1:172749117063:web:b0b53c490ca9dd3ca48a22"
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

const companies = [
  // IT Services
  { name: "Infosys", slug: "infosys", city: "Bengaluru", industry: "IT Services" },
  { name: "Wipro", slug: "wipro", city: "Bengaluru", industry: "IT Services" },
  { name: "HCL Technologies", slug: "hcl-technologies", city: "Noida", industry: "IT Services" },
  { name: "Tech Mahindra", slug: "tech-mahindra", city: "Pune", industry: "IT Services" },
  { name: "Mphasis", slug: "mphasis", city: "Bengaluru", industry: "IT Services" },
  { name: "L&T Technology Services", slug: "lnt-technology-services", city: "Vadodara", industry: "IT Services" },
  { name: "Persistent Systems", slug: "persistent-systems", city: "Pune", industry: "IT Services" },
  { name: "Hexaware Technologies", slug: "hexaware-technologies", city: "Mumbai", industry: "IT Services" },
  { name: "Mindtree", slug: "mindtree", city: "Bengaluru", industry: "IT Services" },
  { name: "Zensar Technologies", slug: "zensar-technologies", city: "Pune", industry: "IT Services" },

  // Product & Startups
  { name: "Zomato", slug: "zomato", city: "Gurugram", industry: "Food Tech" },
  { name: "Swiggy", slug: "swiggy", city: "Bengaluru", industry: "Food Tech" },
  { name: "Razorpay", slug: "razorpay", city: "Bengaluru", industry: "Fintech" },
  { name: "Zepto", slug: "zepto", city: "Mumbai", industry: "Quick Commerce" },
  { name: "CRED", slug: "cred", city: "Bengaluru", industry: "Fintech" },
  { name: "PhonePe", slug: "phonepe", city: "Bengaluru", industry: "Fintech" },
  { name: "Paytm", slug: "paytm", city: "Noida", industry: "Fintech" },
  { name: "Meesho", slug: "meesho", city: "Bengaluru", industry: "E-Commerce" },
  { name: "Groww", slug: "groww", city: "Bengaluru", industry: "Fintech" },
  { name: "Ola", slug: "ola", city: "Bengaluru", industry: "Mobility" },
  { name: "Uber India", slug: "uber-india", city: "Bengaluru", industry: "Mobility" },
  { name: "Nykaa", slug: "nykaa", city: "Mumbai", industry: "E-Commerce" },
  { name: "Myntra", slug: "myntra", city: "Bengaluru", industry: "E-Commerce" },
  { name: "Flipkart", slug: "flipkart", city: "Bengaluru", industry: "E-Commerce" },
  { name: "Amazon India", slug: "amazon-india", city: "Bengaluru", industry: "E-Commerce" },

  // Conglomerates & Large Indian Groups
  { name: "Reliance Industries", slug: "reliance-industries", city: "Mumbai", industry: "Conglomerate" },
  { name: "Adani Group", slug: "adani-group", city: "Ahmedabad", industry: "Conglomerate" },
  { name: "Mahindra & Mahindra", slug: "mahindra-and-mahindra", city: "Mumbai", industry: "Automobile" },
  { name: "Bajaj Auto", slug: "bajaj-auto", city: "Pune", industry: "Automobile" },
  { name: "Hero MotoCorp", slug: "hero-motocorp", city: "New Delhi", industry: "Automobile" },
  { name: "TVS Motor", slug: "tvs-motor", city: "Chennai", industry: "Automobile" },
  { name: "Godrej Group", slug: "godrej-group", city: "Mumbai", industry: "Conglomerate" },
  { name: "Aditya Birla Group", slug: "aditya-birla-group", city: "Mumbai", industry: "Conglomerate" },
  { name: "JSW Steel", slug: "jsw-steel", city: "Mumbai", industry: "Steel & Mining" },
  { name: "Tata Motors", slug: "tata-motors", city: "Mumbai", industry: "Automobile" },
  { name: "Tata Steel", slug: "tata-steel", city: "Mumbai", industry: "Steel & Mining" },

  // BFSI
  { name: "HDFC Bank", slug: "hdfc-bank", city: "Mumbai", industry: "Banking" },
  { name: "ICICI Bank", slug: "icici-bank", city: "Mumbai", industry: "Banking" },
  { name: "Axis Bank", slug: "axis-bank", city: "Mumbai", industry: "Banking" },
  { name: "Kotak Mahindra Bank", slug: "kotak-mahindra-bank", city: "Mumbai", industry: "Banking" },
  { name: "State Bank of India", slug: "state-bank-of-india", city: "Mumbai", industry: "Banking" },
  { name: "LIC", slug: "lic", city: "Mumbai", industry: "Insurance" },
  { name: "HDFC Life", slug: "hdfc-life", city: "Mumbai", industry: "Insurance" },
  { name: "Bajaj Finserv", slug: "bajaj-finserv", city: "Pune", industry: "Fintech" },

  // Media & Telecom
  { name: "Jio", slug: "jio", city: "Mumbai", industry: "Telecom" },
  { name: "Airtel", slug: "airtel", city: "New Delhi", industry: "Telecom" },
  { name: "Vodafone Idea", slug: "vodafone-idea", city: "Mumbai", industry: "Telecom" },
  { name: "Times of India Group", slug: "times-of-india-group", city: "Mumbai", industry: "Media" },
  { name: "Zee Entertainment", slug: "zee-entertainment", city: "Mumbai", industry: "Media" },

  // FMCG & Retail
  { name: "Hindustan Unilever", slug: "hindustan-unilever", city: "Mumbai", industry: "FMCG" },
  { name: "ITC Limited", slug: "itc-limited", city: "Kolkata", industry: "FMCG" },
  { name: "Dabur", slug: "dabur", city: "New Delhi", industry: "FMCG" },
  { name: "Marico", slug: "marico", city: "Mumbai", industry: "FMCG" },
  { name: "Patanjali", slug: "patanjali", city: "Haridwar", industry: "FMCG" },
  { name: "DMart", slug: "dmart", city: "Mumbai", industry: "Retail" },
  { name: "Tata Consumer Products", slug: "tata-consumer-products", city: "Mumbai", industry: "FMCG" },

  // EdTech
  { name: "BYJU'S", slug: "byjus", city: "Bengaluru", industry: "EdTech" },
  { name: "Unacademy", slug: "unacademy", city: "Bengaluru", industry: "EdTech" },
  { name: "upGrad", slug: "upgrad", city: "Mumbai", industry: "EdTech" },
  { name: "Physics Wallah", slug: "physics-wallah", city: "Prayagraj", industry: "EdTech" },

  // MNCs in India
  { name: "Google India", slug: "google-india", city: "Bengaluru", industry: "Technology" },
  { name: "Microsoft India", slug: "microsoft-india", city: "Hyderabad", industry: "Technology" },
  { name: "IBM India", slug: "ibm-india", city: "Bengaluru", industry: "IT Services" },
  { name: "Accenture India", slug: "accenture-india", city: "Mumbai", industry: "IT Services" },
  { name: "Cognizant India", slug: "cognizant-india", city: "Chennai", industry: "IT Services" },
  { name: "Capgemini India", slug: "capgemini-india", city: "Mumbai", industry: "IT Services" },
  { name: "Deloitte India", slug: "deloitte-india", city: "Mumbai", industry: "Consulting" },
  { name: "McKinsey India", slug: "mckinsey-india", city: "Gurugram", industry: "Consulting" },
  { name: "Goldman Sachs India", slug: "goldman-sachs-india", city: "Bengaluru", industry: "Banking" },
  { name: "JP Morgan India", slug: "jp-morgan-india", city: "Mumbai", industry: "Banking" },
]

const seed = async () => {
  console.log(`Seeding ${companies.length} companies...`)
  for (const company of companies) {
    await addDoc(collection(db, "companies"), {
      ...company,
      lalaScore: 0,
      voteCount: 0,
    })
    console.log(`✅ Added: ${company.name}`)
  }
  console.log("🎉 Seeding complete!")
  process.exit(0)
}

seed()