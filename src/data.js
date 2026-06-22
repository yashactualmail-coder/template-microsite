const seo = {
  title: "Fathers And Questions - Papa Ke Financial Sawalon ke Jawab Paiye",
  description: "From credit scores to loan eligibility, here are answers to some of the most common lending-related questions fathers often have.",
  gtmId: "G-3QC163ZJ4R" // Set to empty string or null to disable GTM
};

const styles = {
  layout: {
    sectionHero: "relative min-h-[720px] bg-cover bg-center text-white overflow-hidden py-16 px-4 md:px-8 flex items-center",
    sectionWhite: "bg-white text-[#515151] py-20 px-4 md:px-8",
    sectionFaq: "relative py-20 px-4 md:px-8 bg-gradient-to-b from-white via-[#E7F6FE] to-white",
    sectionReels: "relative py-20 px-4 md:px-8 bg-gradient-to-b from-white to-[#FFF9E5]",
    container: "max-w-[96%] xl:max-w-[1580px] mx-auto w-full",
    gridHero: "grid grid-cols-1 lg:grid-cols-12 gap-24 xl:gap-40 items-center justify-between",
  },
  typography: {
    heroTag: "text-gold font-syne font-bold uppercase tracking-widest text-lg md:text-xl",
    heroTitle: "text-white font-syne font-extrabold text-3xl md:text-5xl lg:text-[42px] leading-tight mt-2",
    heroSubtitle: "text-white font-dm-mono text-sm md:text-base tracking-wider mt-4 block",
    sectionTitle: "text-black font-syne font-bold text-3xl md:text-5xl lg:text-[71px] tracking-tight",
    sectionSubtitle: "text-charcoal font-bricolage text-base md:text-xl max-w-2xl mt-4",
    body: "text-charcoal font-bricolage text-lg md:text-xl leading-relaxed",
    navLink: "text-black hover:text-gold font-dm-mono font-medium text-sm transition-colors",
    footerLink: "text-white hover:text-gold font-dm-mono font-medium text-sm transition-colors",
  },
  components: {
    badge: "inline-flex items-center bg-[#FFCC08] text-[#1A191B] px-6 py-3 font-syne font-black uppercase tracking-wider text-sm md:text-base rounded-sm shadow-sm",
    plusButton: "w-12 h-12 flex items-center justify-center bg-[#F3F5F6] hover:bg-[#E2E5E7] text-black rounded-full transition-colors duration-200 cursor-pointer",
    faqCard: "bg-white border-b border-[#CDD6DA]/60 py-6 transition-all duration-300",
  }
};

const header = {
  logo: {
    img: "./assets/images/header-logo.png",
    alt: "Brand Logo"
  },
  navLinks: [
    { label: "FAQs", url: "#faqs" },
    { label: "About", url: "#about" },
    { label: "Reels", url: "#reels" }
  ]
};

const hero = {
  tagline: "This Father’s Day,",
  title: "Papa Ke Financial Sawalon <br class=\"hidden lg:block\" /> ke Jawab Paiye.",
  subtitle: "Fathers And Questions",
  backgroundImage: "./assets/images/hero-bg.png",
  mainIllustration: "./assets/images/hero-illustration.png",
  fatherImage: "./assets/images/hero-secondary.png",
  logos: [
    { img: "./assets/images/partner-logo-1.png", alt: "L&T Finance", classes: "h-10 md:h-14 lg:h-[4.139vw] lg:max-h-[59.6px] object-contain w-auto rounded-sm shadow-md" },
    { img: "./assets/images/partner-logo-2.png", alt: "Presents", classes: "h-5 md:h-7 lg:h-[2.292vw] lg:max-h-[33px] object-contain w-auto relative top-[8px] lg:top-[12px] right-[4px] lg:right-[8px]" }
  ],
  decorations: {
    desktopBlueMark: "./assets/images/decoration-1.png",
    desktopOrangeMark: "./assets/images/decoration-2.png",
    mobileOrangeMark: "./assets/images/decoration-2.png",
    mobileBlueMark: "./assets/images/decoration-3.png"
  }
};

const about = {
  title: "The Questions Fathers Ask",
  underlineColor: "#0093DD",
  partnerLogo: "./assets/images/about-logo.png",
  description: "From understanding credit scores to figuring out loan eligibility, fathers often have questions about the new ways of borrowing and lending.\nThat's why L&T Finance is reimagining the humble FAQ section as Fathers & Questions, bringing common lending-related queries and answers together in one place."
};

const faqs = {
  title: "FAQ (Fathers and Questions)",
  subtitle: "From credit scores to loan eligibility, here are answers to some of the most common lending-related questions fathers often have.",
  questions: [
    {
      id: "faq-1",
      question: "Everyone talks about credit scores these days. How much do they really matter?",
      answer: "While a score above 750 is generally considered strong, the minimum required score may vary based on the loan product and internal risk assessment."
    },
    {
      id: "faq-2",
      question: "If I'm considering starting something of my own, does it cost anything just to apply for a business loan?",
      answer: "No, there is no application fee for initial inquiry, but other charges like processing fees and legal charges apply."
    },
    {
      id: "faq-3",
      question: "As I get closer to retirement, why might it make sense to close a home loan before the tenure ends?",
      answer: "The most common reasons include:\nFinancial windfalls (bonuses, inherited funds).\nReducing financial burden.\nAvailing better opportunities by clearing liabilities."
    },
    {
      id: "faq-4",
      question: "If I want to start a business of my own now, what kind of credit score would I need?",
      answer: "While a score above 750 is generally considered strong, the minimum required score may vary based on the loan product and internal risk assessment."
    },
    {
      id: "faq-5",
      question: "What kind of interest rate can I expect on a personal loan today?",
      answer: "At L&T Finance, current Personal Loan interest rates start from 11% per annum, but the final rate depends on your creditworthiness and loan specifics."
    },
    {
      id: "faq-6",
      question: "What should I know about how lenders decide the interest rate they offer?",
      answer: "Interest rates are determined based on your credit score, income profile, and repayment history."
    },
    {
      id: "faq-7",
      question: "Can I repay my loan ahead of schedule?",
      answer: "Yes, floating-rate Home Loan holders may prepay partly or fully without foreclosure charges, subject to terms and conditions. Fixed-rate loans may attract penalties as per the applicable fee schedule."
    },
    {
      id: "faq-8",
      question: "Does using an EMI calculator mean my loan will get approved?",
      answer: "No. This EMI calculator provides only an indicative estimate of loan repayments based on inputs. Loan approval depends on various other factors like credit score, income, documentation, and lender's evaluation."
    },
    {
      id: "faq-9",
      question: "It's been years since I applied for a loan. What documents would I need today?",
      answer: "To meet the Personal Loan requirements, applicants must provide a Personal Loan documents list with valid ID proof (Aadhaar, Passport, Voter ID), address proof, PAN card, and recent bank statements. Salary slips are essential for salaried individuals, while self-employed applicants need proof of income. These documents required to get Personal Loan vary slightly based on employment type."
    },
    {
      id: "faq-10",
      question: "If I move from a salaried role to working independently, would the documents I need for a loan change?",
      answer: "Salaried applicants primarily need employment proof (salary slips, Form 16, bank statements showing salary credit). Self-employed applicants must provide business-related financial documents, including ITR with computation of income, audited balance sheets, and Profit & Loss accounts for the last two years. Both groups require standard KYC (ID and Address Proof) and property documents."
    },
    {
      id: "faq-11",
      question: "If I decide to work independently after retirement, can I still get a personal loan without filing ITRs?",
      answer: "Some lenders may accept alternative proofs like GST filings or bank statements."
    },
    {
      id: "faq-12",
      question: "I've heard people switch their loans to save money. Are there any hidden charges I should watch out for?",
      answer: "L&T Finance does not have any hidden charges. We ensure complete transparency and provide a detailed Key Fact Statement (KFS) to the customer outlining all fees and charges before sanctioning the loan, in accordance with RBI guidelines."
    },
    {
      id: "faq-13",
      question: "Are there really no hidden charges in these loans?",
      answer: "No, there are no hidden charges. All applicable charges like processing fees, prepayment penalties, and late payment fees are disclosed to the customer before application and should be reviewed carefully."
    },
    {
      id: "faq-14",
      question: "Can anyone opt for a balance transfer facility?",
      answer: "Any borrower who meets the eligibility criteria set by the new lender can opt for the balance transfer facility. This includes meeting the age, residency, and income criteria specified in the Eligibility section above."
    },
    {
      id: "faq-15",
      question: "Is there any limit on the loan amount that can be transferred?",
      answer: "There is typically no fixed regulatory limit on the outstanding loan amount for a balance transfer; however, lenders may set their own caps. Commonly, balance transfers are available for loans up to ₹7 Crore."
    },
    {
      id: "faq-16",
      question: "Can I apply for a refinance loan without a co-applicant?",
      answer: "Yes, a co-applicant is not always mandatory."
    },
    {
      id: "faq-17",
      question: "Once my loan is approved, how soon will I receive the money?",
      answer: "Once your loan application is approved, the sanctioned amount is disbursed swiftly, usually credited within a day, directly into your bank account."
    },
    {
      id: "faq-18",
      question: "How quickly is the loan amount credited after final approval?",
      answer: "We aim for quick disbursal. The loan amount is typically credited to your bank account within a few hours to 24 hours after final approval and successful document verification."
    },
    {
      id: "faq-19",
      question: "How long does it usually take for a loan application to be processed?",
      answer: "We are committed to giving the best in class service. We will ensure the fastest turnaround time for processing the loan is 6-10 working days ensuring faster TAT. Subject to complete documentation and due diligence."
    },
    {
      id: "faq-20",
      question: "How long does the documentation and approval process usually take?",
      answer: "Typically, the process takes 7 to 15 working days, depending on how quickly the legal and technical verification of the property is completed."
    },
    {
      id: "faq-21",
      question: "Do I still need to visit a branch, or can I submit all my loan documents online?",
      answer: "Yes. Many lenders allow fully digital submission of documents needed for personal loan, making the process faster and hassle-free."
    },
    {
      id: "faq-22",
      question: "If interest rates change, will my EMI or loan tenure change too?",
      answer: "Tenure changes are the default when the interest rate changes. However, the EMI may be revised if required. Notifications about such changes will be communicated accordingly."
    },
    {
      id: "faq-23",
      question: "What is the difference between the loan amount and the interest I pay?",
      answer: "The principal refers to the original amount of money you borrowed, while interest is the additional charge applied by the lender for providing the loan. Each EMI payment consists of both principal and interest components."
    },
    {
      id: "faq-24",
      question: "If I make a partial prepayment, can it reduce my EMI?",
      answer: "Yes, borrowers can reduce their EMIs after a partial prepayment while keeping the loan tenure unchanged. This offers monthly savings and better cash flow."
    },
    {
      id: "faq-25",
      question: "How much can I save by making an early loan payment?",
      answer: "The interest saved depends on the prepayment amount, loan tenure, and interest rate. Use an online prepayment calculator to estimate savings."
    },
    {
      id: "faq-26",
      question: "Is it better to prepay a loan or foreclose it completely?",
      answer: "This depends on your financial goals. Prepayment reduces the principal amount, potentially lowering your EMI, while foreclosure finishes the loan."
    },
    {
      id: "faq-27",
      question: "As I plan for the next phase of life, does closing my home loan early improve my credit profile?",
      answer: "Foreclosing a home loan usually improves your credit score because it shows you've honored your repayment commitments responsibly. Paying off a significant loan early reduces your overall debt, positively influencing creditworthiness and improving chances of eligibility for future credit."
    },
    {
      id: "faq-28",
      question: "What charges should I be aware of when taking a home loan?",
      answer: "These include processing fees, legal and technical evaluation fees, stamp duty, registration, and GST on services."
    },
    {
      id: "faq-29",
      question: "Apart from buying a house, what other benefits can a home loan offer?",
      answer: "Home Loan can help you secure the home you've always wished for. Additionally, it can also allow you to renovate, refurbish or redo your home, exactly the way you want."
    },
    {
      id: "faq-30",
      question: "My son is just starting out in his career. Can someone get a home loan even without income tax returns?",
      answer: "If you do not have ITRs, alternative documents like bank statements, salary slips, and Form 16 may be used. However, document requirements vary by lender and are subject to their policies."
    },
    {
      id: "faq-31",
      question: "I've heard banks and NBFCs work differently. Do they charge different fees for business loans?",
      answer: "Yes. NBFCs may offer quicker processing and flexible approvals but sometimes charge higher admin or service fees."
    },
    {
      id: "faq-32",
      question: "When taking a business loan, are there costs beyond the interest rate that I should be aware of?",
      answer: "Business loan fees are non-interest costs that significantly affect the overall loan cost by increasing the Annual Percentage Rate (APR). The APR represents the true yearly cost of the loan, incorporating both the interest rate and all upfront and ongoing business loan charges."
    },
    {
      id: "faq-33",
      question: "How much can someone borrow through a quick money loan?",
      answer: "Loan amounts range from ₹10,000 up to ₹25 lakh, depending on your income, credit score, and eligibility profile."
    },
    {
      id: "faq-34",
      question: "What is the difference between an instant loan and a traditional loan?",
      answer: "Instant cash loans provide quick disbursal with minimal documentation and a fully digital process. Traditional loans usually require physical verification and take longer to process."
    },
    {
      id: "faq-35",
      question: "Are there any tax benefits available on a personal loan?",
      answer: "Generally, there are no tax benefits associated with Personal Loan repayments. However, you may be eligible for certain tax deductions if the loan is used specifically for home renovation, business purposes, or investing in certain financial assets."
    },
    {
      id: "faq-36",
      question: "With so many uncertainties today, why is general insurance important?",
      answer: "General insurance provides financial security during emergencies, reduces the burden of unexpected expenses and offers peace of mind. It also helps comply with legal requirements (e.g., vehicle motor insurance)."
    },
    {
      id: "faq-37",
      question: "My daughter is exploring different career paths. Can a professional loan be used for education or business growth?",
      answer: "Yes, you can use a professional loan for business expansion, higher education, purchasing equipment, or other professional development purposes."
    },
    {
      id: "faq-38",
      question: "After spending years in a salaried job, can I still apply for a professional loan to pursue something new?",
      answer: "Yes, a salaried individual can apply for a professional loan, especially if it’s intended for career growth, education, or skill enhancement."
    },
    {
      id: "faq-39",
      question: "How long is the repayment tenure for a professional loan?",
      answer: "Professional Loan tenures range up to 60 months at L&T Finance."
    },
    {
      id: "faq-40",
      question: "If someone wants to invest in their professional growth, how can a professional loan help?",
      answer: "The purpose of a Professional Loan is to provide financial assistance to professionals like Company Secretaries for business expansion, working capital, office setup, renovation, and other business-related expenses."
    },
    {
      id: "faq-41",
      question: "How can I repay a professional loan?",
      answer: "You can repay your Professional Loan through monthly EMIs. L&T Finance offers multiple repayment options, including ECS, post-dated cheques, and online payments."
    },
    {
      id: "faq-42",
      question: "These days, who can actually apply for a gold loan?",
      answer: "Any Indian Resident between 18-65 years of age, with valid KYC documents (Proof of Possession of Aadhaar Number, PAN, etc.) can avail the Gold Loan, subject to other eligibility requirements."
    },
    {
      id: "faq-43",
      question: "What is the maximum personal loan amount I can apply for?",
      answer: "The maximum amount for a Personal Loan you can get with L&T Finance is up to ₹30 lakhs."
    },
    {
      id: "faq-44",
      question: "These days, my children seem to use loans differently from the way we did. What are some common reasons people take personal loans?",
      answer: "A Personal Loan can be used for multiple purposes. It includes debt consolidation, medical expenses, home renovation, education, weddings, travel and many more."
    }
  ]
};

const reels = {
  title: "Reels",
  subtitle: "This is just a dummy text that has been inserted as a placeholder for future content.",
  items: [
    {
      id: "reel-1",
      title: "Reel 1",
      placeholderBg: "#D9D9D9",
      videoUrl: "#"
    },
    {
      id: "reel-2",
      title: "Reel 2",
      placeholderBg: "#D9D9D9",
      videoUrl: "#"
    }
  ]
};

const footer = {
  copyright: "Copyright @YourStory 2026",
  backgroundImage: "./assets/images/footer-bg.png",
  logos: [
    { img: "./assets/images/footer-logo-1.png", alt: "L&T Finance" },
    { img: "./assets/images/footer-logo-2.png", alt: "YourStory" }
  ],
  navLinks: [
    { label: "FAQ", url: "#faqs" },
    { label: "About", url: "#about" },
    { label: "Reels", url: "#reels" }
  ]
};

const cta = {
  cardTitle: "Still have a question?",
  cardSubtitle: "Explore lending-related resources and financial insights on the L&T Finance website.",
  buttonText: "Visit L&T Finance",
  buttonUrl: "https://www.ltfs.com/",
  topText: "For every Father who has ever said",
  highlightText: "“Just one more question”",
  bottomText: "Happy Father’s Day from L&T Finance."
};

const data = {
  seo,
  styles,
  header,
  hero,
  about,
  faqs,
  reels,
  cta,
  footer
};

export default data;
