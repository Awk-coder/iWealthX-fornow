import React, { useState } from "react";
import saifImg from "../assets/team/saif.png";
import azmathImg from "../assets/team/azmath.png";
import awkImg from "../assets/team/awk.png";
import helmeyImg from "../assets/team/helmey.png";
import akramImg from "../assets/team/akram.png";
import turalayImg from "../assets/team/turalay.png";
import ezamshahImg from "../assets/team/ezamshah.png";
import debuImg from "../assets/team/debu.png";
import sabithImg from "../assets/team/sabith.png";
import azmiImg from "../assets/team/azmi.png";

const CompanyLogos = ({ companies }) => {
  return (
    <div className="flex items-center gap-6 mt-2">
      {companies.map((company, index) => (
        <img
          key={index}
          src={company}
          alt="Company logo"
          className="h-[100px] w-[80px] object-contain opacity-80"
        />
      ))}
    </div>
  );
};

const AdvisorModal = ({ isOpen, onClose, advisor }) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-8 bg-black/95"
      onClick={handleBackdropClick}
    >
      <div
        className="relative max-w-6xl w-full bg-gradient-to-br from-[#0A0A0A] to-[#121212] rounded-[2.5rem] overflow-hidden"
        style={{ boxShadow: "0 25px 50px -12px rgba(184,134,11,0.15)" }}
      >
        <button
          onClick={onClose}
          className="absolute top-8 right-8 text-gold/80 hover:text-gold transition-colors duration-300 z-10"
        >
          <svg
            className="w-8 h-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="flex flex-col md:flex-row items-stretch">
          {/* Image section */}
          <div className="md:w-[45%] relative">
            <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-[#0A0A0A] md:bg-gradient-to-r" />
            <img
              src={advisor.image}
              alt={advisor.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content section */}
          <div className="md:w-[55%] p-12 md:p-16 md:pl-20 max-h-[80vh] overflow-y-auto custom-scrollbar">
            <div className="mb-12">
              <h2 className="text-text-primary text-4xl font-bold mb-4 leading-tight">
                {advisor.name}
              </h2>
              <p className="text-gold/90 text-xl font-medium">{advisor.role}</p>
            </div>

            <div className="space-y-6">
              {advisor.fullBio.split("\n\n").map((paragraph, index) => (
                <p
                  key={index}
                  className="text-text-secondary/90 text-lg leading-relaxed"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            {advisor.companies && (
              <div className="mt-12 pt-12 border-t border-gold/10">
                <CompanyLogos companies={advisor.companies} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const TeamMember = ({ name, role, image, description, companies, fullBio }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div
        className="relative group rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-gold/20 bg-[#0A0A0A] border border-gold/30 cursor-pointer"
        onClick={() => fullBio && setIsModalOpen(true)}
      >
        {/* Image container */}
        <div className="relative aspect-[3/4] overflow-hidden">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover object-[center_15%] transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500"></div>
        </div>

        {/* Content */}
        <div className="relative p-8 pb-6">
          <h3 className="text-text-primary text-3xl font-bold mb-2">{name}</h3>
          <p className="text-gold text-lg mb-4">{role}</p>
          <p className="text-text-secondary text-base leading-relaxed mb-4">
            {description}
          </p>
          {companies && <CompanyLogos companies={companies} />}
        </div>
      </div>

      {fullBio && (
        <AdvisorModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          advisor={{ name, role, image, fullBio, companies }}
        />
      )}
    </>
  );
};

const Team = () => {
  const teamMembers = [
    {
      name: "Saif Khan",
      role: "Founder & CEO",
      image: saifImg,
      description:
        "Global technology and strategy expert with over 22 years of experience leading transformative initiatives at Siemens, Dell, and Cognizant, specializing in business innovation and digital transformation across multiple industries.",
      companies: [
        require("../assets/company-logos/siemens.png"),
        require("../assets/company-logos/dell.png"),
        require("../assets/company-logos/cognizant.png"),
      ],
    },
    {
      name: "Azmatullah Mohammad",
      role: "Blockchain Lead",
      image: azmathImg,
      description:
        "Seasoned technology leader with 19 years at IBM and tech giants, specializing in blockchain implementation, project management, digital transformation solutions, and enterprise software development.",
      companies: [
        require("../assets/company-logos/ibm.png"),
        require("../assets/company-logos/capgemini.png"),
        require("../assets/company-logos/deloitte.png"),
      ],
    },
    {
      name: "Dr. Sabith Khan",
      role: "Head of Research",
      image: sabithImg,
      description:
        "California-based nonprofit executive and researcher specializing in philanthropy, remittances, and financial flows across Latin America, South Asia, and Middle East regions, with expertise in international development and sustainable community engagement.",
      companies: [
        require("../assets/company-logos/cl.png"),
        require("../assets/company-logos/vt.png"),
        require("../assets/company-logos/tp.png"),
      ],
    },
    {
      name: "Abdul Wahid Khan",
      role: "Developer Intern",
      image: awkImg,
      description:
        "Developer Intern experienced in web development and responsive applications. Proficient in React and modern web technologies. Passionate about creating user-friendly solutions.",
      companies: [
        require("../assets/company-logos/iwx.png"),
      ],
    },
    {
      name: "Helmey Haris",
      role: "Investor Relations",
      image: helmeyImg,
      description:
        "Experienced Shariah finance specialist focusing on investor relationships, stakeholder management, and ensuring compliance with Islamic financial principles across operations.",
      companies: [
        require("../assets/company-logos/hl.png"),
        require("../assets/company-logos/hasco.png"),
        require("../assets/company-logos/hi.png"),
      ],
    },
  ];

  const advisors = [
    {
      name: "Dato' Prof. Dr. Azmi Omar",
      role: "Chairman",
      image: azmiImg,
      description:
        "Pioneering IIUM professor and former IRTI Director General, recognized among top 500 influential personalities in Islamic finance with multiple international awards.",
      companies: [
        require("../assets/company-logos/inceif.png"),
        require("../assets/company-logos/irti.png"),
        require("../assets/company-logos/iium.png"),
      ],
      fullBio: `Dato' Azmi is one of International Islamic University Malaysia's (IIUM) pioneering staff when he joined the then newly set up university in Nov 1983 as a lecturer at the Kulliyyah of Economics and Management Sciences.

      In his 36 years of service to IIUM, he was a professor at the Department of Finance, and Department of Business Administration, Kulliyah of Economics and Management Sciences. He was also the Dean of the Kulliyyah from 1996 to 2003.

      From 2003 to 2008, he held the position of Deputy Rector (Academic and Research). He was the Dean of the Office of Corporate Strategy and Quality Assurance from 2008 to 2009 and the Dean of IUM Institute of Islamic Banking and Finance from 2009 to 2011.

      Prior to joining INCEIF, Dato' Azmi was the Director General of Islamic Research and Training Institute (IRTI) at Islamic Development Bank Group in Jeddah (Jan 2012 – Sept 2017). At IRTI, he had introduced a number of innovative policy research which culminated into flagship reports such as IRTI Islamic Social Finance Report and IsDB-World Bank Global Report on Islamic Finance.

      Over the years, Dato' Azmi has received awards and recognitions at the international and the national levels, including being named in the Top 500 of the world's most prominent and influential personalities in the Islamic world in Islamica 500, The Most Outstanding Individual Contribution to Islamic Finance at the KLIFF Islamic Finance Awards in Kuala Lumpur in 2015, and Lifetime Achievement Award in Islamic Economics and Finance at the 3rd World Islamic Economics and Finance Conference in Pakistan in 2020.`,
    },
    {
      name: "Prof. Datuk Dr. Mohamad Akram Laldin",
      role: "Shariah Advisor",
      image: akramImg,
      description:
        "Distinguished INCEIF professor and global Shariah expert serving on multiple international Islamic financial boards.",
      companies: [
        require("../assets/company-logos/kwsp.png"),
        require("../assets/company-logos/dib.png"),
        require("../assets/company-logos/fab.png"),
      ],
      fullBio: `Datuk Prof. Dr. Mohamad Akram is currently a Professor at INCEIF University, Malaysia. Prior to joining INCEIF, he served as an Assistant Professor at the Kulliyah of Islamic Revealed Knowledge and Human Sciences, International Islamic University Malaysia (IIUM).

      Between 2002 and 2004, he was a Visiting Assistant Professor at the University of Sharjah in the United Arab Emirates. He also held the position of Executive Director at the International Shari'ah Research Academy for Islamic Finance (ISRA), an institution established by Bank Negara Malaysia, until 2023.

      Prof. Akram is an esteemed member of various Shari'ah advisory boards and councils. He is currently a Member of the Shari'ah Advisory Council at Bank Negara Malaysia, a Member of the MIFC Leadership Council, Chairman of the Shari'ah Board of the Employees Provident Fund Malaysia (EPF), and Chairman of the Shariah Supervisory Council of Labuan Financial Services Authority (FSA).

      He holds a B.A. Honours degree in Islamic Jurisprudence and Legislation from the University of Jordan in Amman and a Ph.D. in Principles of Islamic Jurisprudence (Usul al-Fiqh) from the University of Edinburgh in Scotland.`,
    },
    {
      name: "Dr. Turalay Kenc",
      role: "Regulatory Advisor",
      image: turalayImg,
      description:
        "Former central bank executive and regulatory specialist with extensive experience in financial markets, policy development, international banking frameworks, global economic research methodologies, and strategic monetary policy implementation.",
      companies: [
        require("../assets/company-logos/inceif.png"),
        require("../assets/company-logos/tcmb.png"),
        require("../assets/company-logos/icl.png"),
      ],
      fullBio: `Prof. Turalay Kenc brings a wealth of experience from his distinguished career spanning central banking, academia, and international financial institutions. His expertise encompasses monetary policy, financial markets, and economic research, making him a valuable advisor on regulatory frameworks and financial governance.

      Throughout his career, he has gained extensive work and consultancy experience from prestigious institutions worldwide. His contributions include advisory roles at the US Federal Reserve, UK's Official Monetary and Financial Institutions Forum (OMFIF), the Centre for International Governance Innovation in Canada, and the Kazakhstan National Bank, demonstrating his global influence in financial policy and regulation.

      His academic career has been equally impressive, having held positions at several prestigious UK institutions. He has contributed to research and teaching at the University of Cambridge, Birkbeck College London, the University of Durham, and Imperial College London in various capacities. Prior to his role at the Central Bank of the Republic of Turkey, he served as Professor of Finance at the Bradford University School of Management, where he made significant contributions to financial education and research.

      In April 2009, he joined the Central Bank of the Republic of Turkey as a Board Member, where he played a crucial role in shaping monetary policy and financial stability measures. His leadership extended to chairing the Bank for International Settlements' Irving Fisher Committee on Central Bank Statistics, where he contributed to advancing statistical methodologies and practices in central banking.

      As editor-in-chief of the Central Banking Review-Journal, he has fostered academic discourse and research in central banking and monetary policy. His multifaceted experience in academia, central banking, and international advisory roles provides unique insights into the complexities of global financial markets and regulatory frameworks.`,
    },
    {
      name: "Ezamshah Ismail",
      role: "Risk Management Advisor",
      image: ezamshahImg,
      description:
        "Specialist in risk management and financial strategy implementation with extensive experience in Islamic finance and banking sectors.",
      companies: [
        require("../assets/company-logos/inceif.png"),
        require("../assets/company-logos/liam.png"),
        require("../assets/company-logos/hl.png"),
      ],
      fullBio: `Ezamshah Ismail brings decades of invaluable experience in insurance, Takaful, and risk management to his advisory role. His academic foundation includes a Masters Degree in Actuarial Science from North Eastern University, Boston, complemented by his prestigious designation as an Associate of the Society of Actuaries of USA.

      Throughout his distinguished career, he has held several pivotal leadership positions in Malaysia's insurance and Takaful sector. As the former President of the Life Insurance Association of Malaysia (LIAM), he played a crucial role in shaping the industry's development and establishing best practices that continue to influence the sector today.

      His executive experience includes serving as CEO of Hong Leong Tokio Marine Takaful Bhd., where he demonstrated exceptional leadership in Islamic insurance operations. Prior to this, he served as CEO/Director of Commerce Life Assurance Berhad, where he contributed significantly to the company's growth and strategic direction. His tenure as Managing Principal and director of William Mercer in Kuala Lumpur further showcases his expertise in financial consulting and risk management.

      Ezamshah's commitment to the industry extends beyond his executive roles. He has served as a director for several key institutions, including the Malaysian Institute of Insurance, where he contributed to professional development and industry standards. His role at the Financial Mediation Bureau (formerly known as Insurance Mediation) demonstrated his dedication to ensuring fair practices and consumer protection in the insurance sector.

      His unique combination of actuarial expertise, executive leadership, and deep understanding of both conventional insurance and Takaful principles makes him an invaluable advisor in risk management and Islamic finance. His experience bridges the gap between technical actuarial knowledge and practical business implementation, providing crucial insights for strategic decision-making.`,
    },
    {
      name: "Debu Dasgupta",
      role: "AI, Data & Tech Advisor",
      image: debuImg,
      description:
        "Innovation leader with extensive experience at Ford, HP, and Cognizant, specializing in AI implementation and data-driven technological solutions.",
      companies: [
        require("../assets/company-logos/ford.png"),
        require("../assets/company-logos/hp.png"),
        require("../assets/company-logos/cognizant.png"),
      ],
      fullBio: `Debu Dasgupta is a distinguished Technology Visionary and Business Mentor with a remarkable track record in creating and scaling businesses from the ground up. His expertise lies in guiding organizations to develop and execute effective strategies, particularly in bridging the gap between complex business challenges and innovative technology solutions.

      As a Multiple Technology Practice Head, he has demonstrated exceptional ability in building comprehensive technology practices that consistently exceed customer expectations. His approach combines deep technical knowledge with strategic business acumen, enabling him to successfully bid, win, and deliver sophisticated solutions while serving as a "Trusted Advisor" to major corporations.

      Throughout his career, he has excelled in directing the technology roadmap of large organizations, both in-house and in outsourced environments. His major strength lies in his unique ability to understand and connect business requirements with technological capabilities, often serving as the crucial bridge between these two domains.

      Currently, he is focused on bringing his decades of experience to mentor and guide Tech Start-ups across various sectors, including Fintech, Insurance, and Healthcare. His involvement extends to supporting a well-respected Education NGO, demonstrating his commitment to giving back to the community.

      His expertise in wow-ing customers through both business and technology depths has made him a sought-after advisor in the technology sector. His approach to problem-solving and strategy development continues to influence and shape the direction of numerous organizations in their digital transformation journeys.`,
    },
  ];

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <section className="pt-48 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto mb-20">
            <h2 className="text-gold text-xl font-medium tracking-wider uppercase mb-4">
              Our Team
            </h2>
            <h1 className="text-text-primary text-5xl lg:text-6xl font-bold mb-8">
              Meet the Experts Behind
              <br />
              Our Success
            </h1>
            <p className="text-text-secondary text-xl leading-relaxed">
              Our diverse team brings together expertise in Islamic finance,
              sustainable investments, and technology to make impact investing
              accessible to everyone.
            </p>
          </div>

          {/* Team Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <TeamMember
                key={index}
                name={member.name}
                role={member.role}
                image={member.image}
                description={member.description}
                companies={member.companies}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Advisors Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <h2 className="text-gold text-xl font-medium tracking-wider uppercase mb-4">
              Our Advisors
            </h2>
            <h3 className="text-text-primary text-4xl font-bold mb-8">
              Expert Guidance
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {advisors.map((advisor, index) => (
              <TeamMember
                key={index}
                name={advisor.name}
                role={advisor.role}
                image={advisor.image}
                description={advisor.description}
                companies={advisor.companies}
                fullBio={advisor.fullBio}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <h2 className="text-gold text-xl font-medium tracking-wider uppercase mb-4">
              Our Values
            </h2>
            <h3 className="text-text-primary text-4xl font-bold">
              What Drives Us Forward
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Islamic Values",
                description:
                  "We ensure all our operations and investments strictly adhere to Shariah principles.",
              },
              {
                title: "Sustainability",
                description:
                  "Environmental and social impact is at the heart of every investment decision we make.",
              },
              {
                title: "Innovation",
                description:
                  "We leverage technology to make impact investing accessible and efficient.",
              },
              {
                title: "Transparency",
                description:
                  "We believe in complete transparency in all our operations and investments.",
              },
              {
                title: "Community Focus",
                description:
                  "We prioritize investments that create positive impact in communities.",
              },
              {
                title: "Excellence",
                description:
                  "We strive for excellence in everything we do, from investment selection to customer service.",
              },
            ].map((value, index) => (
              <div
                key={index}
                className="p-8 border border-gold/30 rounded-3xl hover:border-gold/50 transition-all duration-300"
              >
                <h4 className="text-text-primary text-2xl font-bold mb-4">
                  {value.title}
                </h4>
                <p className="text-text-secondary">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Team;
