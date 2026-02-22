/**
 * ABK Unlimited — Local content data
 * Serves as the data source when Google Sheets is not configured.
 * This is the SAME data that would live in the Google Sheet.
 */

export const LOCAL_DATA: Record<string, Record<string, string>[]> = {
  site_config: [
    { key: "business_name", value: "ABK Unlimited" },
    { key: "tagline", value: "Pittsburgh's Trusted General Contractor" },
    { key: "phone", value: "(412) 944-1683" },
    { key: "phone_raw", value: "+14129441683" },
    { key: "email", value: "abk.unlimited@gmail.com" },
    { key: "address", value: "138 Balver Ave, Pittsburgh, PA 15205" },
    { key: "website", value: "https://abkunlimited.com" },
    { key: "founded_year", value: "2020" },
    { key: "license_number", value: "PA163301" },
    { key: "gc_license", value: "GC-2021-002697" },
    { key: "primary_color", value: "#14664f" },
    { key: "secondary_color", value: "#1a1a2e" },
    { key: "accent_color", value: "#1a8a6a" },
    { key: "facebook_url", value: "https://www.facebook.com/profile.php?id=100065571905770" },
    { key: "houzz_url", value: "https://www.houzz.com/professionals/general-contractors/abk-unlimited-pfvwus-pf~222150373" },
    { key: "crm_tracking_id", value: "tk_646afa21f1344a9f960010e84b1aeea4" },
    { key: "hours_weekday", value: "07:00 - 18:00" },
    { key: "hours_saturday", value: "08:00 - 14:00" },
    { key: "hours_sunday", value: "Closed" },
    { key: "service_area", value: "Greater Pittsburgh, Allegheny County & Surrounding Areas" },
    { key: "price_range", value: "$10,000 - $500,000" },
    { key: "rating", value: "5.0" },
    { key: "review_count", value: "9+" },
    { key: "projects_completed", value: "" },
    { key: "years_experience", value: "5+" },
  ],

  services: [
    {
      id: "svc-kitchen", title: "Kitchen Remodeling", slug: "kitchen-remodeling",
      description: "Transform your kitchen into the heart of your home. From minor updates to complete renovations, ABK Unlimited creates stunning, functional kitchens tailored to your lifestyle.",
      image_id: "", icon: "ChefHat", order: "1",
      features: "Custom Cabinet Design & Installation|Granite, Quartz & Marble Countertops|Kitchen Island Construction|Appliance Installation & Upgrades|Backsplash Tile Installation|Under-Cabinet & Recessed Lighting|Flooring Installation|Plumbing & Electrical Updates",
      price_range: "$15,000 - $150,000+",
    },
    {
      id: "svc-bathroom", title: "Bathroom Remodeling", slug: "bathroom-remodeling",
      description: "Create your personal spa retreat. From powder room updates to complete master bathroom transformations, we bring luxury and functionality to every project.",
      image_id: "", icon: "Bath", order: "2",
      features: "Walk-In Shower Installation|Soaking & Freestanding Tubs|Custom Vanity Design|Heated Floor Installation|Tile & Stone Work|Lighting & Ventilation|Plumbing Upgrades|ADA Accessible Options",
      price_range: "$8,000 - $75,000+",
    },
    {
      id: "svc-basement", title: "Basement Finishing", slug: "basement-finishing",
      description: "Unlock your home's hidden potential. Transform unused basement space into beautiful, functional living areas that add value to your property.",
      image_id: "", icon: "Home", order: "3",
      features: "Waterproofing & Moisture Control|Framing & Insulation|Electrical & Lighting|HVAC Extension|Flooring Installation|Bathroom Addition|Egress Window Installation|Custom Built-Ins",
      price_range: "$25,000 - $100,000+",
    },
    {
      id: "svc-additions", title: "Home Additions", slug: "home-additions",
      description: "Need more space? We design and build seamless home additions that look like they've always been there, adding value and functionality to your property.",
      image_id: "", icon: "Building2", order: "4",
      features: "Room Additions|Second Story Additions|Sunrooms & Four-Season Rooms|In-Law Suites|Garage Additions|Bump-Outs|Structural Engineering|Permit Management",
      price_range: "$50,000 - $250,000+",
    },
    {
      id: "svc-roofing", title: "Roofing", slug: "roofing",
      description: "Expert roof replacement, repair, and installation with premium materials and industry-leading warranties. Trusted by Pittsburgh homeowners.",
      image_id: "", icon: "Home", order: "5",
      features: "Roof Replacement|Roof Repair|Metal Roofing|Flat Roofing|Gutter Installation|Skylight Installation|Emergency Repairs|Insurance Claims",
      price_range: "$8,000 - $50,000+",
    },
    {
      id: "svc-decks", title: "Deck Building", slug: "deck-building",
      description: "Extend your living space outdoors with a custom-designed deck. We build beautiful, durable outdoor spaces for Pittsburgh's four seasons.",
      image_id: "", icon: "Fence", order: "6",
      features: "Composite Decking (Trex, TimberTech)|Premium Wood Options|Custom Railings & Stairs|Built-In Seating & Planters|Pergolas & Shade Structures|Outdoor Lighting|Permit Handling|Multi-Level Designs",
      price_range: "$25,000 - $100,000+",
    },
    {
      id: "svc-flooring", title: "Flooring Installation", slug: "flooring-installation",
      description: "Transform your space from the ground up. Expert flooring installation with premium materials and meticulous attention to detail.",
      image_id: "", icon: "Layers", order: "7",
      features: "Hardwood Floor Installation|Tile & Stone Installation|Luxury Vinyl Plank (LVP)|Carpet Installation|Floor Refinishing|Subfloor Repair|Heated Floor Systems|Custom Patterns & Inlays",
      price_range: "$4 - $25/sq ft installed",
    },
    {
      id: "svc-custom-homes", title: "Custom Homes", slug: "custom-homes",
      description: "Build the home you've always envisioned. From concept to completion, we bring your dream home to life with expert craftsmanship and personalized attention.",
      image_id: "", icon: "Castle", order: "8",
      features: "Full Design-Build Services|Site Selection Assistance|Architectural Planning|Energy-Efficient Construction|Smart Home Integration|Premium Material Selection|Project Management|Warranty & Support",
      price_range: "$300,000 - $1,000,000+",
    },
    {
      id: "svc-commercial", title: "Commercial Construction", slug: "commercial-construction",
      description: "Professional commercial construction and tenant improvements. We build spaces that help businesses thrive.",
      image_id: "", icon: "Building", order: "9",
      features: "Office Buildouts & Renovations|Retail Space Construction|Restaurant Build-Outs|Medical & Dental Offices|Warehouse & Industrial|Tenant Improvements|ADA Compliance|Code & Permit Management",
      price_range: "Custom pricing",
    },
  ],

  portfolio: [
    { id: "port-1", title: "Modern Kitchen Transformation", description: "Complete kitchen renovation featuring custom white shaker cabinets, quartz countertops, and professional-grade appliances.", image_ids: "", category: "Kitchen Remodeling", date: "2024", location: "Mt. Lebanon, PA" },
    { id: "port-2", title: "Spa-Like Master Bathroom", description: "Luxurious master bath with freestanding soaking tub, frameless glass shower, and heated marble floors.", image_ids: "", category: "Bathroom Remodeling", date: "2024", location: "Sewickley, PA" },
    { id: "port-3", title: "Entertainment Basement", description: "Full basement finish with home theater, wet bar, and guest suite. 1,500 sq ft of new living space.", image_ids: "", category: "Basement Finishing", date: "2024", location: "Cranberry Township, PA" },
    { id: "port-4", title: "Multi-Level Composite Deck", description: "Custom Trex deck with built-in seating, pergola, and outdoor kitchen area. Perfect for entertaining.", image_ids: "", category: "Deck Building", date: "2024", location: "Upper St. Clair, PA" },
    { id: "port-5", title: "Traditional Kitchen Remodel", description: "Classic cherry cabinet kitchen with granite counters and custom island.", image_ids: "", category: "Kitchen Remodeling", date: "2023", location: "Bethel Park, PA" },
    { id: "port-6", title: "Contemporary Double Vanity Bath", description: "Modern bathroom featuring floating double vanity and walk-in shower.", image_ids: "", category: "Bathroom Remodeling", date: "2023", location: "Moon Township, PA" },
    { id: "port-7", title: "Home Office Addition", description: "400 sq ft home office addition with built-in bookcases and private entrance.", image_ids: "", category: "Home Additions", date: "2023", location: "Robinson, PA" },
    { id: "port-8", title: "Hardwood Floor Installation", description: "2,000 sq ft of white oak hardwood throughout main level with custom stain.", image_ids: "", category: "Flooring", date: "2023", location: "Pittsburgh, PA" },
    { id: "port-9", title: "Farmhouse Kitchen", description: "Charming farmhouse kitchen with shaker cabinets and apron sink.", image_ids: "", category: "Kitchen Remodeling", date: "2023", location: "Cranberry Township, PA" },
  ],

  testimonials: [
    { id: "test-1", name: "Jennifer M.", role: "Homeowner, Mt. Lebanon", text: "ABK Unlimited transformed our outdated 1950s kitchen into a modern showpiece. The team was professional, on schedule, and the attention to detail was incredible. We couldn't be happier with the result!", rating: "5", image_id: "", project_type: "Kitchen Remodel" },
    { id: "test-2", name: "David & Sarah K.", role: "Homeowners, Moon Township", text: "After getting burned by another contractor, we were hesitant to start our basement project. ABK was completely different \u2014 transparent pricing, regular updates, and the finished result exceeded our expectations.", rating: "5", image_id: "", project_type: "Basement Finishing" },
    { id: "test-3", name: "Michael R.", role: "Homeowner, Sewickley", text: "Our deck was falling apart and we needed it replaced before summer. ABK designed a beautiful multi-level Trex deck with a built-in pergola. It was done on time and on budget. Their craftsmanship is top-notch.", rating: "5", image_id: "", project_type: "Deck Building" },
    { id: "test-4", name: "Michael & Sarah Thompson", role: "Homeowners, Mt. Lebanon, PA", text: "ABK Unlimited transformed our dated kitchen into a stunning modern space. The team was professional, clean, and finished on time. The attention to detail was incredible \u2014 from the custom cabinetry to the backsplash installation. Highly recommend!", rating: "5", image_id: "", project_type: "Kitchen Remodel" },
    { id: "test-5", name: "Jennifer Martinez", role: "Homeowner, Sewickley, PA", text: "We hired ABK for a complete home renovation and couldn't be happier. They handled everything from design to final walkthrough. Communication was excellent throughout the 4-month project. Our house feels brand new!", rating: "5", image_id: "", project_type: "Full Home Renovation" },
    { id: "test-6", name: "Robert & Linda Chen", role: "Homeowners, Cranberry Township, PA", text: "ABK turned our unfinished basement into an amazing entertainment space with a wet bar and home theater. The craftsmanship is top-notch. They stayed within budget and even suggested cost-saving alternatives without sacrificing quality.", rating: "5", image_id: "", project_type: "Basement Finishing" },
    { id: "test-7", name: "David Patterson", role: "Homeowner, Moon Township, PA", text: "Our new composite deck is beautiful! ABK handled all permits and built a custom design that perfectly complements our home. The outdoor living space has completely changed how we use our backyard.", rating: "5", image_id: "", project_type: "Deck Construction" },
    { id: "test-8", name: "Amanda & James Wilson", role: "Homeowners, Upper St. Clair, PA", text: "We renovated two bathrooms with ABK and the results exceeded our expectations. The tile work is flawless, and they helped us select fixtures that elevated the design. Professional crew that respected our home.", rating: "5", image_id: "", project_type: "Bathroom Remodel" },
    { id: "test-9", name: "Patricia O'Brien", role: "Homeowner, Bethel Park, PA", text: "ABK built a beautiful 500 sq ft addition that seamlessly matches our existing home. The structural work and finishing are impeccable. Worth every penny \u2014 they truly care about quality.", rating: "5", image_id: "", project_type: "Home Addition" },
  ],

  blog: [
    {
      id: "blog-1", title: "Top Kitchen Remodel Trends for 2025", slug: "kitchen-remodel-trends-2025",
      content: "The kitchen continues to be the heart of the home, and 2025 brings exciting new trends. From bold color choices to smart appliance integration, here's what's trending in Pittsburgh kitchen remodeling.\n\n## 1. Two-Tone Cabinetry\nMixing cabinet colors adds depth and visual interest. The most popular combination? Navy blue lower cabinets with white uppers.\n\n## 2. Quartz Countertops Dominate\nQuartz continues to outpace granite for its durability, low maintenance, and design versatility.\n\n## 3. Smart Kitchen Integration\nWi-Fi-enabled appliances, touchless faucets, and under-cabinet charging stations are now standard in high-end remodels.\n\n## 4. Open Shelving Accents\nWhile full open shelving is declining, accent sections of open shelving mixed with traditional cabinets creates a curated look.\n\n## 5. Oversized Islands\nKitchen islands continue to grow, serving as dining, prep, and social hub all in one.\n\nReady to bring these trends to your Pittsburgh kitchen? Contact ABK Unlimited for a free design consultation.",
      excerpt: "The kitchen continues to be the heart of the home, and 2025 brings exciting new trends. From bold color choices to smart appliance integration, here's what's trending.",
      image_id: "", published_at: "2025-01-05", status: "published", author: "ABK Unlimited Team", category: "Kitchen", read_time: "6 min",
    },
    {
      id: "blog-2", title: "Bathroom Renovation ROI: What to Expect", slug: "bathroom-renovation-roi",
      content: "Thinking about a bathroom remodel? Here's what you need to know about return on investment for different types of bathroom renovations in the Pittsburgh market.\n\n## Average ROI by Project Type\n\n### Minor Bathroom Remodel (60-70% ROI)\n- Updated fixtures and hardware\n- New vanity and mirror\n- Fresh paint and lighting\n- Budget: $8,000-$15,000\n\n### Mid-Range Bathroom Remodel (55-65% ROI)\n- New tile floors and shower surround\n- Updated plumbing fixtures\n- New vanity with stone countertop\n- Budget: $15,000-$35,000\n\n### Upscale Master Bathroom (50-60% ROI)\n- Walk-in shower with frameless glass\n- Freestanding soaking tub\n- Heated floors\n- Custom cabinetry\n- Budget: $35,000-$75,000\n\n## Tips to Maximize ROI\n1. Don't over-improve for your neighborhood\n2. Stick to neutral, timeless finishes\n3. Focus on quality fixtures that last\n4. Ensure proper waterproofing\n\nContact ABK Unlimited to discuss your bathroom renovation and get a free estimate.",
      excerpt: "Thinking about a bathroom remodel? Here's what you need to know about return on investment for different types of bathroom renovations in the Pittsburgh market.",
      image_id: "", published_at: "2024-12-28", status: "published", author: "ABK Unlimited Team", category: "Bathroom", read_time: "5 min",
    },
    {
      id: "blog-3", title: "Complete Guide to Finishing Your Basement", slug: "basement-finishing-guide",
      content: "Your basement represents untapped potential. Here's everything Pittsburgh homeowners need to know about transforming that unfinished space into valuable living area.\n\n## Before You Start\n\n### Address Moisture First\nPittsburgh's climate means moisture control is critical. Before any finishing work:\n- Check for water intrusion after heavy rains\n- Consider interior/exterior waterproofing\n- Install a quality sump pump system\n- Use vapor barriers on walls and floors\n\n### Check Building Codes\nAllegheny County requires:\n- Minimum 7-foot ceiling height\n- Egress windows in bedrooms\n- Smoke and carbon monoxide detectors\n- Proper electrical and plumbing permits\n\n## Popular Basement Layouts\n\n### Entertainment Hub\nHome theater, gaming area, and wet bar. Budget: $40,000-$80,000\n\n### Guest Suite\nBedroom, bathroom, and sitting area. Budget: $35,000-$60,000\n\n### Home Office\nDedicated workspace away from household distractions. Budget: $15,000-$30,000\n\n## Timeline\nMost basement finishing projects take 6-10 weeks from start to finish.\n\nReady to unlock your basement's potential? ABK Unlimited offers free in-home consultations.",
      excerpt: "Your basement represents untapped potential. Here's everything Pittsburgh homeowners need to know about transforming that unfinished space into valuable living area.",
      image_id: "", published_at: "2024-12-15", status: "published", author: "ABK Unlimited Team", category: "Basement", read_time: "8 min",
    },
    {
      id: "blog-4", title: "Composite vs Wood Decking: Which Is Right for You?", slug: "deck-material-comparison",
      content: "Choosing between composite and wood decking? Both have pros and cons for Pittsburgh's four-season climate. Here's a detailed comparison to help you decide.\n\n## Composite Decking\n\n### Pros\n- Minimal maintenance (no staining/sealing)\n- Won't rot, warp, or splinter\n- 25-year+ warranties\n- Consistent appearance over time\n- Eco-friendly (made from recycled materials)\n\n### Cons\n- Higher upfront cost ($45-85/sq ft installed)\n- Can get hot in direct sun\n- Limited ability to refinish\n\n## Pressure-Treated Wood\n\n### Pros\n- Lower upfront cost ($25-40/sq ft installed)\n- Natural wood appearance\n- Can be stained any color\n- Easy to repair individual boards\n\n### Cons\n- Requires annual maintenance\n- Will crack, warp, and splinter over time\n- Shorter lifespan (10-15 years)\n\n## Our Recommendation\nFor most Pittsburgh homeowners, composite decking is the better long-term investment. The higher upfront cost is offset by virtually zero maintenance over 25+ years.\n\nContact ABK Unlimited for a free deck consultation and quote.",
      excerpt: "Choosing between composite and wood decking? Both have pros and cons for Pittsburgh's four-season climate. Here's a detailed comparison.",
      image_id: "", published_at: "2024-12-01", status: "published", author: "ABK Unlimited Team", category: "Outdoor", read_time: "7 min",
    },
    {
      id: "blog-5", title: "Planning a Home Addition: What You Need to Know", slug: "home-addition-planning",
      content: "A home addition is one of the most significant investments you can make. Here's what every Pittsburgh homeowner should consider before breaking ground.\n\n## Types of Home Additions\n\n### Room Addition (Ground Floor)\nExpand your home's footprint. Ideal when you have available lot space.\n- Average cost: $150-$300/sq ft\n- Timeline: 2-4 months\n\n### Second Story Addition\nBuild up when you can't build out. More complex but preserves yard space.\n- Average cost: $200-$400/sq ft\n- Timeline: 3-6 months\n\n### Sunroom/Four-Season Room\nEnjoy the outdoors year-round. Great for Pittsburgh's variable weather.\n- Average cost: $100-$250/sq ft\n- Timeline: 6-10 weeks\n\n## Key Planning Steps\n1. Check local zoning and setback requirements\n2. Determine if your lot and foundation can support the addition\n3. Match architectural style to existing home\n4. Plan for HVAC extension and electrical upgrades\n5. Get proper permits (ABK handles this)\n\nReady to add space to your Pittsburgh home? Contact ABK Unlimited for a free consultation.",
      excerpt: "A home addition is one of the most significant investments you can make. Here's what every Pittsburgh homeowner should consider before breaking ground.",
      image_id: "", published_at: "2024-11-18", status: "published", author: "ABK Unlimited Team", category: "Additions", read_time: "6 min",
    },
    {
      id: "blog-6", title: "How to Choose the Right Flooring for Each Room", slug: "choosing-flooring",
      content: "The right flooring can transform a room. But with so many options, how do you choose? Here's our room-by-room guide for Pittsburgh homes.\n\n## Kitchen\nBest options: Tile, luxury vinyl plank (LVP), hardwood. Needs water resistance and durability.\n\n## Bathroom\nBest options: Porcelain tile, natural stone, vinyl. Must be waterproof.\n\n## Living Room\nBest options: Hardwood, engineered wood, LVP. Hardwood adds the most value.\n\n## Bedroom\nBest options: Hardwood, carpet, engineered wood. Carpet provides warmth and comfort.\n\n## Basement\nBest options: LVP, tile, epoxy. Must handle potential moisture. Never install hardwood in basements.\n\n## Price Ranges (Installed)\n- Carpet: $4-12/sq ft\n- Luxury Vinyl: $6-15/sq ft\n- Hardwood: $8-25/sq ft\n- Tile: $10-30/sq ft\n\nNeed help choosing? ABK Unlimited provides free flooring consultations for Pittsburgh homeowners.",
      excerpt: "The right flooring can transform a room. But with so many options, how do you choose? Here's our room-by-room guide for Pittsburgh homes.",
      image_id: "", published_at: "2024-11-05", status: "published", author: "ABK Unlimited Team", category: "Flooring", read_time: "5 min",
    },
  ],

  team: [
    { id: "team-1", name: "Project Management", role: "Planning & Coordination", bio: "Dedicated project managers oversee every job from start to finish — coordinating schedules, managing budgets, and keeping you informed at every step.", image_id: "" },
    { id: "team-2", name: "Skilled Trades", role: "Construction & Finishing", bio: "Our licensed craftsmen handle everything from framing and electrical to finish carpentry and tile work. No subcontractor roulette — you get our team, every time.", image_id: "" },
    { id: "team-3", name: "Client Care", role: "Communication & Support", bio: "From your initial consultation through warranty support, our client care team ensures you have a seamless, stress-free experience.", image_id: "" },
  ],

  faqs: [
    { id: "faq-1", question: "How much does a new roof cost in Pittsburgh, PA?", answer: "In Pittsburgh, a complete roof replacement typically costs between $8,000 and $20,000 for an average-sized home (1,500-2,500 sq ft). Asphalt shingles average $9,500, while architectural shingles run $12,000-$15,000. Metal roofing starts around $15,000. ABK Unlimited provides free detailed estimates with no obligation.", category: "Roofing" },
    { id: "faq-2", question: "How much should a 2000 sq ft roof cost?", answer: "A 2,000 square foot roof in Pittsburgh typically costs $10,000-$16,000 for standard asphalt shingles, including tear-off and disposal. For architectural shingles, expect $13,000-$18,000. Metal roofing for this size runs $18,000-$28,000.", category: "Roofing" },
    { id: "faq-3", question: "What does a roofer charge per hour in Pittsburgh?", answer: "Pittsburgh roofers typically charge $45-$75 per hour for labor, but most residential projects are quoted as flat-rate jobs rather than hourly. ABK Unlimited provides transparent flat-rate pricing for all roofing projects.", category: "Roofing" },
    { id: "faq-4", question: "How to spot a bad roofing company?", answer: "Red flags include: demanding large upfront payments (legitimate contractors ask for 10-30% deposit), no physical address or PA contractor license, pressure to sign immediately, inability to provide references, no written contract, and unusually low bids. Always verify licensing at PA's contractor verification website.", category: "Roofing" },
    { id: "faq-5", question: "How long does a roof replacement take?", answer: "Most residential roof replacements in Pittsburgh take 1-3 days depending on size, complexity, and weather. A standard 2,000 sq ft roof with a single layer tear-off typically completes in 1-2 days.", category: "Roofing" },
    { id: "faq-6", question: "Does homeowner's insurance cover roof replacement?", answer: "Homeowner's insurance typically covers roof damage from sudden events like storms, hail, fallen trees, or fire. Normal wear and aging are not covered. ABK Unlimited works directly with insurance adjusters and can help document damage for your claim.", category: "Roofing" },
    { id: "faq-7", question: "What is the 30% rule in home renovation?", answer: "The 30% rule suggests that the cost of a remodeling project should not exceed 30% of your home's current value. For example, if your home is worth $300,000, you should aim to spend no more than $90,000 on renovations.", category: "Remodeling" },
    { id: "faq-8", question: "Is $50,000 enough to renovate a home?", answer: "Yes, $50,000 can accomplish significant renovations depending on your priorities. In Pittsburgh, $50,000 could include a mid-range kitchen renovation ($35,000) plus bathroom updates ($15,000), or a complete basement finishing project.", category: "Remodeling" },
    { id: "faq-9", question: "Is $100,000 enough to renovate a house?", answer: "A $100,000 budget provides substantial renovation possibilities. In the Pittsburgh market, this can cover a high-end kitchen remodel ($60,000-$75,000) plus a luxury bathroom ($25,000-$35,000), or multiple mid-range projects throughout your home.", category: "Remodeling" },
    { id: "faq-10", question: "What is a reasonable budget for remodeling?", answer: "A reasonable remodeling budget depends on your goals and home value. Most financial experts recommend spending 5-15% of your home's value on renovations. Kitchens and bathrooms typically offer the best ROI.", category: "Remodeling" },
    { id: "faq-11", question: "How long does a whole-home remodel take?", answer: "A complete whole-home remodel typically takes 3-6 months depending on scope. Kitchen remodels average 6-8 weeks, bathrooms 2-4 weeks, and basements 6-10 weeks.", category: "Remodeling" },
    { id: "faq-12", question: "Do I need permits for remodeling in Pittsburgh?", answer: "Most significant remodeling projects in Pittsburgh require permits. This includes structural changes, electrical work, plumbing modifications, and additions. ABK Unlimited handles all permit applications and inspections as part of our service.", category: "Remodeling" },
  ],

  seo: [
    { page_path: "/", title: "ABK Unlimited | Pittsburgh's Trusted General Contractor | Kitchen & Bath Remodeling", description: "Award-winning Pittsburgh general contractor specializing in kitchen remodeling, bathroom renovations, basement finishing & deck building. Licensed & insured. Free estimates. Call (412) 944-1683.", og_image_id: "" },
    { page_path: "/about", title: "About ABK Unlimited | Pittsburgh General Contractor | Licensed & Insured", description: "ABK Unlimited is a family-owned general contractor serving Greater Pittsburgh. PA Licensed (HIC #PA163301), BBB A+ Rated, Best of Houzz 2025. Kitchen, bathroom, basement, and whole-home remodeling.", og_image_id: "" },
    { page_path: "/services", title: "Our Services | ABK Unlimited Pittsburgh General Contractor", description: "Comprehensive home remodeling services in Pittsburgh. Kitchen & bathroom remodeling, basement finishing, deck building, home additions, flooring, custom homes & commercial construction.", og_image_id: "" },
    { page_path: "/portfolio", title: "Portfolio | ABK Unlimited Pittsburgh General Contractor", description: "View our portfolio of completed projects. Kitchen remodels, bathroom renovations, basement finishing, decks & more.", og_image_id: "" },
    { page_path: "/testimonials", title: "Customer Reviews & Testimonials | ABK Unlimited Pittsburgh Contractor", description: "Read verified reviews from Pittsburgh homeowners. See why ABK Unlimited is rated 5 stars.", og_image_id: "" },
    { page_path: "/blog", title: "Blog | ABK Unlimited Pittsburgh Home Remodeling Tips & Ideas", description: "Expert home remodeling tips, design ideas, and advice from ABK Unlimited.", og_image_id: "" },
    { page_path: "/contact", title: "Contact ABK Unlimited | Pittsburgh General Contractor", description: "Contact ABK Unlimited for your home remodeling project. Call (412) 944-1683 or fill out our form for a free estimate.", og_image_id: "" },
  ],

  custom_apps: [],

  webhooks: [],

  custom_endpoints: [],
};
