export type StateOption = {
  code: string;
  name: string;
  cities: string[];
  wageIndex: number;
};

export type Trade = {
  id: string;
  title: string;
  category: string;
  subcategory: string;
  soc?: string;
  onet?: string;
  nationalMedian: number;
  summary: string;
  duties: string[];
  training: string[];
  credentials: string[];
  nextSteps: string[];
  sourceNote: string;
};

export const states: StateOption[] = [
  { code: "AL", name: "Alabama", cities: ["Birmingham", "Montgomery", "Mobile", "Huntsville"], wageIndex: 0.9 },
  { code: "AK", name: "Alaska", cities: ["Anchorage", "Fairbanks", "Juneau"], wageIndex: 1.22 },
  { code: "AZ", name: "Arizona", cities: ["Phoenix", "Tucson", "Mesa", "Flagstaff"], wageIndex: 1.03 },
  { code: "AR", name: "Arkansas", cities: ["Little Rock", "Fayetteville", "Fort Smith"], wageIndex: 0.88 },
  { code: "CA", name: "California", cities: ["Los Angeles", "San Diego", "San Jose", "Sacramento", "Fresno"], wageIndex: 1.34 },
  { code: "CO", name: "Colorado", cities: ["Denver", "Colorado Springs", "Aurora", "Fort Collins"], wageIndex: 1.12 },
  { code: "CT", name: "Connecticut", cities: ["Bridgeport", "Hartford", "New Haven", "Stamford"], wageIndex: 1.19 },
  { code: "DE", name: "Delaware", cities: ["Wilmington", "Dover", "Newark"], wageIndex: 1.03 },
  { code: "FL", name: "Florida", cities: ["Jacksonville", "Miami", "Tampa", "Orlando", "Tallahassee"], wageIndex: 1.0 },
  { code: "GA", name: "Georgia", cities: ["Atlanta", "Augusta", "Savannah", "Columbus"], wageIndex: 0.99 },
  { code: "HI", name: "Hawaii", cities: ["Honolulu", "Hilo", "Kailua"], wageIndex: 1.18 },
  { code: "ID", name: "Idaho", cities: ["Boise", "Meridian", "Idaho Falls"], wageIndex: 0.95 },
  { code: "IL", name: "Illinois", cities: ["Chicago", "Springfield", "Peoria", "Rockford"], wageIndex: 1.08 },
  { code: "IN", name: "Indiana", cities: ["Indianapolis", "Fort Wayne", "Evansville"], wageIndex: 0.94 },
  { code: "IA", name: "Iowa", cities: ["Des Moines", "Cedar Rapids", "Davenport"], wageIndex: 0.94 },
  { code: "KS", name: "Kansas", cities: ["Wichita", "Overland Park", "Kansas City"], wageIndex: 0.92 },
  { code: "KY", name: "Kentucky", cities: ["Louisville", "Lexington", "Bowling Green"], wageIndex: 0.91 },
  { code: "LA", name: "Louisiana", cities: ["New Orleans", "Baton Rouge", "Lafayette"], wageIndex: 0.95 },
  { code: "ME", name: "Maine", cities: ["Portland", "Lewiston", "Bangor"], wageIndex: 1.0 },
  { code: "MD", name: "Maryland", cities: ["Baltimore", "Frederick", "Rockville"], wageIndex: 1.13 },
  { code: "MA", name: "Massachusetts", cities: ["Boston", "Worcester", "Springfield"], wageIndex: 1.25 },
  { code: "MI", name: "Michigan", cities: ["Detroit", "Grand Rapids", "Lansing"], wageIndex: 0.99 },
  { code: "MN", name: "Minnesota", cities: ["Minneapolis", "Saint Paul", "Duluth"], wageIndex: 1.05 },
  { code: "MS", name: "Mississippi", cities: ["Jackson", "Gulfport", "Hattiesburg"], wageIndex: 0.84 },
  { code: "MO", name: "Missouri", cities: ["Kansas City", "Saint Louis", "Springfield"], wageIndex: 0.94 },
  { code: "MT", name: "Montana", cities: ["Billings", "Missoula", "Bozeman"], wageIndex: 0.97 },
  { code: "NE", name: "Nebraska", cities: ["Omaha", "Lincoln", "Grand Island"], wageIndex: 0.93 },
  { code: "NV", name: "Nevada", cities: ["Las Vegas", "Reno", "Henderson"], wageIndex: 1.06 },
  { code: "NH", name: "New Hampshire", cities: ["Manchester", "Nashua", "Concord"], wageIndex: 1.08 },
  { code: "NJ", name: "New Jersey", cities: ["Newark", "Jersey City", "Trenton"], wageIndex: 1.2 },
  { code: "NM", name: "New Mexico", cities: ["Albuquerque", "Santa Fe", "Las Cruces"], wageIndex: 0.95 },
  { code: "NY", name: "New York", cities: ["New York", "Buffalo", "Rochester", "Albany"], wageIndex: 1.23 },
  { code: "NC", name: "North Carolina", cities: ["Charlotte", "Raleigh", "Greensboro"], wageIndex: 0.96 },
  { code: "ND", name: "North Dakota", cities: ["Fargo", "Bismarck", "Grand Forks"], wageIndex: 1.0 },
  { code: "OH", name: "Ohio", cities: ["Columbus", "Cleveland", "Cincinnati", "Toledo"], wageIndex: 0.97 },
  { code: "OK", name: "Oklahoma", cities: ["Oklahoma City", "Tulsa", "Norman"], wageIndex: 0.9 },
  { code: "OR", name: "Oregon", cities: ["Portland", "Salem", "Eugene"], wageIndex: 1.12 },
  { code: "PA", name: "Pennsylvania", cities: ["Philadelphia", "Pittsburgh", "Harrisburg"], wageIndex: 1.01 },
  { code: "RI", name: "Rhode Island", cities: ["Providence", "Warwick", "Cranston"], wageIndex: 1.05 },
  { code: "SC", name: "South Carolina", cities: ["Charleston", "Columbia", "Greenville"], wageIndex: 0.92 },
  { code: "SD", name: "South Dakota", cities: ["Sioux Falls", "Rapid City", "Aberdeen"], wageIndex: 0.88 },
  { code: "TN", name: "Tennessee", cities: ["Nashville", "Memphis", "Knoxville", "Chattanooga"], wageIndex: 0.92 },
  { code: "TX", name: "Texas", cities: ["Houston", "Dallas", "Austin", "San Antonio", "Fort Worth"], wageIndex: 1.02 },
  { code: "UT", name: "Utah", cities: ["Salt Lake City", "Provo", "Ogden"], wageIndex: 1.0 },
  { code: "VT", name: "Vermont", cities: ["Burlington", "Rutland", "Montpelier"], wageIndex: 1.02 },
  { code: "VA", name: "Virginia", cities: ["Virginia Beach", "Richmond", "Norfolk", "Alexandria"], wageIndex: 1.04 },
  { code: "WA", name: "Washington", cities: ["Seattle", "Spokane", "Tacoma", "Vancouver"], wageIndex: 1.23 },
  { code: "WV", name: "West Virginia", cities: ["Charleston", "Morgantown", "Huntington"], wageIndex: 0.86 },
  { code: "WI", name: "Wisconsin", cities: ["Milwaukee", "Madison", "Green Bay"], wageIndex: 0.98 },
  { code: "WY", name: "Wyoming", cities: ["Cheyenne", "Casper", "Laramie"], wageIndex: 0.99 },
];

const fieldDefaults = {
  construction: {
    duties: ["Read plans, measurements, and jobsite instructions", "Install, repair, or assemble materials to code", "Use hand and power tools safely", "Inspect finished work and correct defects"],
    training: ["Start with a helper role, pre-apprenticeship, trade school, or registered apprenticeship", "Complete safety training such as OSHA 10 or OSHA 30", "Build supervised hours and document jobsite experience", "Prepare for any state, local, or contractor exam"],
    credentials: ["OSHA safety card", "Registered apprenticeship completion where available", "State, city, or contractor license when required"],
  },
  mechanical: {
    duties: ["Install and service mechanical, electrical, or fluid systems", "Diagnose failures using meters, gauges, and service records", "Replace worn parts and test performance", "Document repairs and follow safety procedures"],
    training: ["Complete a trade certificate, apprenticeship, or employer training program", "Learn electrical safety, schematics, controls, and troubleshooting", "Gain supervised field experience", "Add manufacturer or specialty certifications"],
    credentials: ["EPA, manufacturer, or specialty certification when applicable", "State mechanical, electrical, or contractor license where required", "OSHA safety training"],
  },
  healthcare: {
    duties: ["Prepare patients, rooms, records, or equipment", "Follow clinical safety and privacy procedures", "Perform role-specific technical tasks under scope of practice", "Document care or service activity accurately"],
    training: ["Enroll in a state-approved or employer-recognized program", "Complete classroom, lab, and clinical practice requirements", "Pass required background, immunization, and exam steps", "Apply for state certification or registration where required"],
    credentials: ["State certification, registration, or license where required", "CPR or basic life support", "National certification preferred by employers"],
  },
  transportation: {
    duties: ["Inspect equipment before operation", "Operate vehicles, aircraft, vessels, or machinery safely", "Follow federal, state, and employer rules", "Maintain logs, records, and service reports"],
    training: ["Complete approved technical training or employer training", "Practice operating procedures under supervision", "Pass written, road, practical, or equipment exams", "Keep medical, safety, or endorsement requirements current"],
    credentials: ["CDL, FAA, Coast Guard, or equipment credential where required", "Endorsements for specialized work", "Safety and drug-testing compliance"],
  },
  industrial: {
    duties: ["Operate, set up, maintain, or inspect production equipment", "Read blueprints, work orders, and quality standards", "Use measurement and diagnostic tools", "Support productivity, safety, and quality goals"],
    training: ["Complete technical school, apprenticeship, or employer training", "Learn blueprint reading, measurement, and safety", "Build machine, process, or maintenance experience", "Add industry certifications for advancement"],
    credentials: ["NIMS, AWS, NCCER, PLC, or manufacturer credential where relevant", "OSHA safety training", "Apprenticeship completion certificate"],
  },
  services: {
    duties: ["Consult with customers and assess service needs", "Perform hands-on technical or personal services", "Sanitize, maintain, and organize tools and equipment", "Manage appointments, records, and repeat client care"],
    training: ["Complete state-approved school or apprenticeship when required", "Practice technical skills in supervised settings", "Prepare for practical and written exams", "Understand business, sanitation, and customer service rules"],
    credentials: ["State board license where required", "Specialty certification for advanced services", "Business license for independent work"],
  },
  land: {
    duties: ["Operate tools, machinery, or outdoor equipment", "Inspect plants, land, water, animals, or natural resources", "Follow environmental and safety standards", "Record work, yields, repairs, or compliance steps"],
    training: ["Complete technical training, extension programs, or employer training", "Learn equipment safety and environmental rules", "Gain seasonal or supervised field experience", "Add pesticide, equipment, or conservation certifications"],
    credentials: ["Pesticide applicator, CDL, or equipment certification when required", "State natural resource permits for regulated work", "OSHA or first aid training"],
  },
};

function makeTrade(input: Omit<Trade, "duties" | "training" | "credentials" | "nextSteps" | "sourceNote"> & {
  profile: keyof typeof fieldDefaults;
  duties?: string[];
  training?: string[];
  credentials?: string[];
  nextSteps?: string[];
}): Trade {
  const defaults = fieldDefaults[input.profile];
  return {
    ...input,
    duties: input.duties || defaults.duties,
    training: input.training || defaults.training,
    credentials: input.credentials || defaults.credentials,
    nextSteps: input.nextSteps || [
      "Confirm state and city license rules before enrolling.",
      "Compare apprenticeships, community colleges, unions, and employer-sponsored programs.",
      "Ask local employers which credentials they hire for and which they sponsor.",
    ],
    sourceNote: "Seeded editorial guidance; official details load from CareerOneStop when credentials are configured.",
  };
}

export const trades: Trade[] = [
  makeTrade({ id: "electrician", title: "Electrician", category: "Construction & Building", subcategory: "Electrical", soc: "47-2111", onet: "47-2111.00", nationalMedian: 61200, profile: "construction", summary: "Installs, repairs, and tests wiring, panels, controls, fixtures, and electrical systems.", credentials: ["State or local electrician license", "Journeyman license after required hours and exam", "Master license for contracting or advanced work", "OSHA safety card"] }),
  makeTrade({ id: "plumber", title: "Plumber", category: "Construction & Building", subcategory: "Pipe Trades", soc: "47-2152", onet: "47-2152.02", nationalMedian: 61700, profile: "construction", summary: "Installs and repairs water, drainage, gas, and fixture systems.", credentials: ["Journeyman plumber license where required", "Gas fitting endorsement where required", "Contractor license for independent business"] }),
  makeTrade({ id: "hvac-technician", title: "HVAC Technician", category: "Mechanical & Utilities", subcategory: "Climate Control", soc: "49-9021", onet: "49-9021.01", nationalMedian: 59000, profile: "mechanical", summary: "Installs, services, and repairs heating, ventilation, air conditioning, and refrigeration systems.", credentials: ["EPA Section 608 certification", "State HVAC or mechanical license where required", "NATE or manufacturer certification"] }),
  makeTrade({ id: "welder", title: "Welder", category: "Manufacturing & Industrial", subcategory: "Fabrication", soc: "51-4121", onet: "51-4121.06", nationalMedian: 48500, profile: "industrial", summary: "Joins metal parts using arc, MIG, TIG, flux-core, resistance, or gas welding processes.", credentials: ["AWS welding certifications", "Process-specific weld qualification tests", "OSHA safety training"] }),
  makeTrade({ id: "carpenter", title: "Carpenter", category: "Construction & Building", subcategory: "Structural & Finish", soc: "47-2031", onet: "47-2031.01", nationalMedian: 56600, profile: "construction", summary: "Builds, repairs, and installs frameworks, structures, forms, doors, trim, and fixtures." }),
  makeTrade({ id: "mason", title: "Mason", category: "Construction & Building", subcategory: "Masonry", soc: "47-2021", onet: "47-2021.00", nationalMedian: 55300, profile: "construction", summary: "Builds and repairs walls, chimneys, walkways, veneer, foundations, and stone or block structures." }),
  makeTrade({ id: "roofer", title: "Roofer", category: "Construction & Building", subcategory: "Exterior Systems", soc: "47-2181", onet: "47-2181.00", nationalMedian: 49200, profile: "construction", summary: "Installs, repairs, and replaces roof systems using shingles, membranes, metal, tile, insulation, and waterproofing." }),
  makeTrade({ id: "sheet-metal-worker", title: "Sheet Metal Worker", category: "Construction & Building", subcategory: "Metal & Duct", soc: "47-2211", onet: "47-2211.00", nationalMedian: 62300, profile: "construction", summary: "Fabricates and installs ductwork, architectural metal, roofing, siding, and industrial sheet metal products." }),
  makeTrade({ id: "elevator-installer", title: "Elevator Installer and Repairer", category: "Mechanical & Utilities", subcategory: "Vertical Transport", soc: "47-4021", onet: "47-4021.00", nationalMedian: 102400, profile: "mechanical", summary: "Installs, maintains, and repairs elevators, escalators, lifts, controls, motors, doors, and safety systems.", credentials: ["State elevator mechanic license in many states", "Registered apprenticeship completion", "NAEC CET or equivalent credential", "Continuing education"] }),
  makeTrade({ id: "heavy-equipment-operator", title: "Heavy Equipment Operator", category: "Construction & Building", subcategory: "Equipment Operation", soc: "47-2073", onet: "47-2073.00", nationalMedian: 58600, profile: "transportation", summary: "Operates excavators, loaders, graders, dozers, compactors, and other machinery for construction and site work." }),
  makeTrade({ id: "crane-operator", title: "Crane Operator", category: "Construction & Building", subcategory: "Equipment Operation", soc: "53-7021", onet: "53-7021.00", nationalMedian: 67100, profile: "transportation", summary: "Operates cranes to lift, move, and place heavy materials safely.", credentials: ["NCCCO or equivalent certification", "State or city crane license where required", "Signal person or rigging credential"] }),
  makeTrade({ id: "construction-supervisor", title: "Construction Supervisor", category: "Construction & Building", subcategory: "Leadership", soc: "47-1011", onet: "47-1011.00", nationalMedian: 76600, profile: "construction", summary: "Leads crews, schedules work, checks quality, coordinates materials, and manages jobsite safety.", credentials: ["OSHA 30", "NCCER supervisor credential", "Contractor license where required"] }),
  makeTrade({ id: "construction-laborer", title: "Construction Laborer", category: "Construction & Building", subcategory: "General Trades", soc: "47-2061", onet: "47-2061.00", nationalMedian: 46350, profile: "construction", summary: "Prepares jobsites, moves materials, supports skilled trades, cleans work areas, and performs basic installation tasks." }),
  makeTrade({ id: "painter", title: "Painter", category: "Construction & Building", subcategory: "Finishes", soc: "47-2141", onet: "47-2141.00", nationalMedian: 48600, profile: "construction", summary: "Prepares surfaces and applies paint, coatings, stains, sealants, and wall coverings." }),
  makeTrade({ id: "drywall-installer", title: "Drywall Installer and Finisher", category: "Construction & Building", subcategory: "Interior Systems", soc: "47-2081", nationalMedian: 54000, profile: "construction", summary: "Installs wallboard, tapes seams, applies compound, sands surfaces, and prepares walls for finish work." }),
  makeTrade({ id: "flooring-installer", title: "Flooring Installer", category: "Construction & Building", subcategory: "Interior Systems", soc: "47-2042", nationalMedian: 49300, profile: "construction", summary: "Installs carpet, hardwood, laminate, tile, vinyl, and resilient flooring systems." }),
  makeTrade({ id: "glazier", title: "Glazier", category: "Construction & Building", subcategory: "Glass & Openings", soc: "47-2121", nationalMedian: 58700, profile: "construction", summary: "Installs glass, windows, storefronts, curtain walls, mirrors, and specialty glazing systems." }),
  makeTrade({ id: "insulation-worker", title: "Insulation Worker", category: "Construction & Building", subcategory: "Energy Envelope", soc: "47-2131", nationalMedian: 52300, profile: "construction", summary: "Installs thermal, acoustic, and mechanical insulation in buildings and industrial systems." }),
  makeTrade({ id: "pipefitter", title: "Pipefitter and Steamfitter", category: "Mechanical & Utilities", subcategory: "Pipe Trades", soc: "47-2152", nationalMedian: 68000, profile: "mechanical", summary: "Installs and maintains high-pressure piping for heating, cooling, manufacturing, and industrial systems.", credentials: ["Apprenticeship completion", "Welding certifications where needed", "State or local license where required"] }),
  makeTrade({ id: "boilermaker", title: "Boilermaker", category: "Mechanical & Utilities", subcategory: "Industrial Systems", soc: "47-2011", nationalMedian: 71100, profile: "mechanical", summary: "Assembles, installs, maintains, and repairs boilers, vats, tanks, and pressure vessels." }),
  makeTrade({ id: "millwright", title: "Millwright", category: "Manufacturing & Industrial", subcategory: "Industrial Maintenance", soc: "49-9044", nationalMedian: 63100, profile: "industrial", summary: "Installs, aligns, dismantles, repairs, and moves industrial machinery and production equipment." }),
  makeTrade({ id: "industrial-maintenance", title: "Industrial Maintenance Technician", category: "Manufacturing & Industrial", subcategory: "Industrial Maintenance", soc: "49-9041", onet: "49-9041.00", nationalMedian: 63500, profile: "industrial", summary: "Maintains production equipment, conveyors, motors, pumps, sensors, robotics, and automated systems." }),
  makeTrade({ id: "cnc-machinist", title: "CNC Machinist", category: "Manufacturing & Industrial", subcategory: "Precision Machining", soc: "51-4041", onet: "51-4041.00", nationalMedian: 52300, profile: "industrial", summary: "Sets up and operates CNC mills, lathes, grinders, and inspection tools to produce precision parts.", credentials: ["NIMS machining credentials", "Apprenticeship completion certificate", "CAM software certificates"] }),
  makeTrade({ id: "tool-and-die-maker", title: "Tool and Die Maker", category: "Manufacturing & Industrial", subcategory: "Precision Machining", soc: "51-4111", nationalMedian: 62700, profile: "industrial", summary: "Builds, repairs, and modifies dies, jigs, fixtures, gauges, and precision tools for manufacturing." }),
  makeTrade({ id: "robotics-technician", title: "Robotics Technician", category: "Manufacturing & Industrial", subcategory: "Automation", nationalMedian: 65300, profile: "industrial", summary: "Installs, maintains, programs, and troubleshoots robots, sensors, controls, and automated cells.", credentials: ["PLC or robotics certificate", "Manufacturer training", "OSHA safety training"] }),
  makeTrade({ id: "quality-inspector", title: "Quality Control Inspector", category: "Manufacturing & Industrial", subcategory: "Quality", soc: "51-9061", nationalMedian: 47700, profile: "industrial", summary: "Inspects products, measurements, materials, and production records to confirm standards are met." }),
  makeTrade({ id: "lineworker", title: "Electrical Lineworker", category: "Mechanical & Utilities", subcategory: "Power Utility", soc: "49-9051", onet: "49-9051.00", nationalMedian: 85300, profile: "mechanical", summary: "Installs and repairs power distribution and transmission lines, poles, transformers, and utility equipment.", credentials: ["CDL often required", "Lineworker apprenticeship", "First aid and pole-top rescue", "OSHA utility safety training"] }),
  makeTrade({ id: "substation-technician", title: "Substation Technician", category: "Mechanical & Utilities", subcategory: "Power Utility", nationalMedian: 78100, profile: "mechanical", summary: "Maintains electrical substations, relays, transformers, breakers, control systems, and grid equipment.", credentials: ["Electrical or utility apprenticeship", "Relay or substation training", "CDL or safety credentials where required"] }),
  makeTrade({ id: "water-treatment-operator", title: "Water Treatment Operator", category: "Mechanical & Utilities", subcategory: "Water & Wastewater", soc: "51-8031", nationalMedian: 54100, profile: "mechanical", summary: "Operates water or wastewater treatment systems, tests samples, adjusts chemicals, and maintains equipment.", credentials: ["State water or wastewater operator certification", "Continuing education", "Safety and confined-space training"] }),
  makeTrade({ id: "solar-installer", title: "Solar PV Installer", category: "Energy & Environment", subcategory: "Solar", soc: "47-2231", onet: "47-2231.00", nationalMedian: 48900, profile: "construction", summary: "Installs solar panels, racking, wiring support, inverters, and related photovoltaic equipment.", credentials: ["NABCEP credential", "Electrical license for wiring where required", "OSHA 10"] }),
  makeTrade({ id: "wind-turbine-technician", title: "Wind Turbine Technician", category: "Energy & Environment", subcategory: "Wind", soc: "49-9081", onet: "49-9081.00", nationalMedian: 61400, profile: "mechanical", summary: "Maintains wind turbines, blades, gearboxes, generators, braking systems, hydraulics, and controls.", credentials: ["GWO safety training", "Wind technician certificate", "Manufacturer training"] }),
  makeTrade({ id: "energy-auditor", title: "Energy Auditor", category: "Energy & Environment", subcategory: "Efficiency", nationalMedian: 61200, profile: "construction", summary: "Inspects buildings to identify energy waste, air leaks, insulation gaps, equipment issues, and savings opportunities.", credentials: ["BPI or RESNET certification", "Building science training", "State program credentials where required"] }),
  makeTrade({ id: "automotive-technician", title: "Automotive Service Technician", category: "Transportation & Aviation", subcategory: "Automotive", soc: "49-3023", onet: "49-3023.00", nationalMedian: 49250, profile: "transportation", summary: "Inspects, diagnoses, repairs, and maintains cars, trucks, hybrids, EVs, and light-duty vehicles.", credentials: ["ASE certifications", "EPA 609 for mobile AC", "Manufacturer certifications"] }),
  makeTrade({ id: "diesel-technician", title: "Diesel Technician", category: "Transportation & Aviation", subcategory: "Diesel & Fleet", soc: "49-3031", onet: "49-3031.00", nationalMedian: 58700, profile: "transportation", summary: "Maintains diesel engines, fuel systems, brakes, drivetrains, hydraulics, emissions systems, and heavy vehicles.", credentials: ["ASE diesel certifications", "CDL can help", "Manufacturer certifications"] }),
  makeTrade({ id: "truck-driver", title: "Commercial Truck Driver", category: "Transportation & Aviation", subcategory: "Commercial Driving", soc: "53-3032", onet: "53-3032.00", nationalMedian: 54800, profile: "transportation", summary: "Operates heavy trucks to move freight, materials, equipment, or specialized loads.", credentials: ["Commercial Driver's License", "FMCSA Entry-Level Driver Training", "Medical examiner certificate", "Hazmat, tanker, passenger, or doubles endorsements"] }),
  makeTrade({ id: "aircraft-mechanic", title: "Aircraft Mechanic", category: "Transportation & Aviation", subcategory: "Aviation Maintenance", soc: "49-3011", onet: "49-3011.00", nationalMedian: 75000, profile: "transportation", summary: "Inspects, services, and repairs aircraft engines, airframes, electrical systems, and components.", credentials: ["FAA Airframe and Powerplant certificate", "FAA Part 147 school or qualifying experience", "Manufacturer training"] }),
  makeTrade({ id: "avionics-technician", title: "Avionics Technician", category: "Transportation & Aviation", subcategory: "Aviation Electronics", soc: "49-2091", nationalMedian: 78200, profile: "transportation", summary: "Installs, tests, and repairs aircraft navigation, communication, radar, autopilot, and control electronics.", credentials: ["FCC or NCATT credential can help", "FAA repair station training", "Manufacturer training"] }),
  makeTrade({ id: "marine-mechanic", title: "Marine Mechanic", category: "Transportation & Aviation", subcategory: "Marine", soc: "49-3051", nationalMedian: 52900, profile: "transportation", summary: "Maintains and repairs boat engines, propulsion systems, electrical systems, steering, and marine equipment." }),
  makeTrade({ id: "emt", title: "Emergency Medical Technician", category: "Healthcare & Public Safety", subcategory: "Emergency Medical", soc: "29-2042", onet: "29-2042.00", nationalMedian: 44100, profile: "healthcare", summary: "Provides emergency medical care, patient assessment, CPR, basic life support, and ambulance transport.", credentials: ["NREMT exam in many states", "State EMT license or certification", "CPR or BLS certification"] }),
  makeTrade({ id: "paramedic", title: "Paramedic", category: "Healthcare & Public Safety", subcategory: "Emergency Medical", soc: "29-2043", nationalMedian: 53300, profile: "healthcare", summary: "Provides advanced emergency medical care, medication administration, cardiac monitoring, and transport.", credentials: ["State paramedic license", "NREMT paramedic exam in many states", "ACLS and BLS certifications"] }),
  makeTrade({ id: "firefighter", title: "Firefighter", category: "Healthcare & Public Safety", subcategory: "Fire Service", soc: "33-2011", onet: "33-2011.00", nationalMedian: 57600, profile: "healthcare", summary: "Responds to fires, rescues, medical emergencies, hazardous incidents, and public safety calls.", credentials: ["Fire academy completion", "State firefighter certification", "EMT or paramedic license often required", "Hazmat training"] }),
  makeTrade({ id: "medical-assistant", title: "Medical Assistant", category: "Healthcare & Public Safety", subcategory: "Clinical Support", soc: "31-9092", onet: "31-9092.00", nationalMedian: 42900, profile: "healthcare", summary: "Performs clinical and administrative tasks such as vitals, rooming patients, injections, scheduling, and records.", credentials: ["CMA, RMA, CCMA, or equivalent", "CPR certification", "State scope compliance"] }),
  makeTrade({ id: "dental-assistant", title: "Dental Assistant", category: "Healthcare & Public Safety", subcategory: "Dental", soc: "31-9091", onet: "31-9091.00", nationalMedian: 47000, profile: "healthcare", summary: "Assists dentists, sterilizes instruments, supports patients, manages records, and takes X-rays where permitted.", credentials: ["DANB certification", "State radiography permit where required", "Expanded function credentials in some states"] }),
  makeTrade({ id: "pharmacy-technician", title: "Pharmacy Technician", category: "Healthcare & Public Safety", subcategory: "Pharmacy", soc: "29-2052", nationalMedian: 43700, profile: "healthcare", summary: "Assists pharmacists with prescriptions, inventory, customer service, insurance processing, and medication safety.", credentials: ["State registration or license", "PTCB or ExCPT certification", "Background check where required"] }),
  makeTrade({ id: "surgical-technologist", title: "Surgical Technologist", category: "Healthcare & Public Safety", subcategory: "Surgical Support", soc: "29-2055", nationalMedian: 60400, profile: "healthcare", summary: "Prepares operating rooms, instruments, sterile fields, and assists surgical teams during procedures.", credentials: ["Accredited surgical technology program", "CST certification preferred or required by some employers", "BLS certification"] }),
  makeTrade({ id: "cosmetologist", title: "Cosmetologist", category: "Personal Services", subcategory: "Beauty", soc: "39-5012", onet: "39-5012.00", nationalMedian: 38600, profile: "services", summary: "Provides hair cutting, styling, coloring, chemical treatments, and salon services.", credentials: ["State cosmetology license", "Required school or apprenticeship hours", "Continuing education where required"] }),
  makeTrade({ id: "barber", title: "Barber", category: "Personal Services", subcategory: "Grooming", soc: "39-5011", onet: "39-5011.00", nationalMedian: 37800, profile: "services", summary: "Cuts, styles, trims, shaves, and grooms hair and facial hair.", credentials: ["State barber license", "Required school or apprenticeship hours", "Sanitation and practical exam"] }),
  makeTrade({ id: "esthetician", title: "Esthetician", category: "Personal Services", subcategory: "Skin Care", soc: "39-5094", nationalMedian: 43800, profile: "services", summary: "Provides skin care services, facials, hair removal, product guidance, sanitation, and client care.", credentials: ["State esthetician license", "Required school hours", "Advanced service certification where required"] }),
  makeTrade({ id: "massage-therapist", title: "Massage Therapist", category: "Personal Services", subcategory: "Wellness", soc: "31-9011", nationalMedian: 55500, profile: "services", summary: "Provides therapeutic massage, client assessments, treatment plans, documentation, and wellness support.", credentials: ["State massage therapy license where required", "Approved massage program", "MBLEx exam in many states"] }),
  makeTrade({ id: "appliance-repair", title: "Appliance Repair Technician", category: "Mechanical & Utilities", subcategory: "Home Service", soc: "49-9031", onet: "49-9031.00", nationalMedian: 48900, profile: "mechanical", summary: "Diagnoses and repairs refrigerators, washers, dryers, ranges, dishwashers, and related equipment.", credentials: ["EPA Section 608 if handling refrigerants", "Manufacturer certifications", "Business license for self-employment"] }),
  makeTrade({ id: "locksmith", title: "Locksmith", category: "Mechanical & Utilities", subcategory: "Security Hardware", soc: "49-9094", onet: "49-9094.00", nationalMedian: 47900, profile: "mechanical", summary: "Installs, repairs, rekeys, and opens locks and security hardware; may service access control systems.", credentials: ["State locksmith license where required", "Background check in many jurisdictions", "ALOA certifications can help"] }),
  makeTrade({ id: "low-voltage-technician", title: "Low Voltage Technician", category: "Technology Infrastructure", subcategory: "Cabling & Systems", nationalMedian: 56900, profile: "mechanical", summary: "Installs and services data cabling, security systems, fire alarms, cameras, access control, and network infrastructure.", credentials: ["Low-voltage license where required", "BICSI, NICET, or manufacturer certification", "OSHA safety training"] }),
  makeTrade({ id: "fiber-optic-technician", title: "Fiber Optic Technician", category: "Technology Infrastructure", subcategory: "Telecommunications", soc: "49-9052", nationalMedian: 62200, profile: "mechanical", summary: "Installs, splices, tests, repairs, and documents fiber optic cable and telecom network systems.", credentials: ["Fiber optic association or manufacturer credential", "Bucket truck or safety training", "CDL can help for field work"] }),
  makeTrade({ id: "network-cabling-installer", title: "Network Cabling Installer", category: "Technology Infrastructure", subcategory: "Cabling & Systems", nationalMedian: 52100, profile: "mechanical", summary: "Installs structured cabling, racks, patch panels, labeling, testing, and network room infrastructure.", credentials: ["BICSI Installer credential", "Manufacturer certification", "Low-voltage license where required"] }),
  makeTrade({ id: "commercial-diver", title: "Commercial Diver", category: "Marine & Outdoor Trades", subcategory: "Underwater Work", soc: "49-9092", nationalMedian: 67000, profile: "transportation", summary: "Performs underwater inspection, welding, construction, repair, salvage, and maintenance work.", credentials: ["Commercial diving school certificate", "ADC or equivalent credentials", "Diving medical clearance"] }),
  makeTrade({ id: "pest-control-technician", title: "Pest Control Technician", category: "Agriculture & Natural Resources", subcategory: "Pest Management", soc: "37-2021", nationalMedian: 44600, profile: "land", summary: "Inspects properties, identifies pests, applies treatments, documents service, and follows pesticide regulations.", credentials: ["State pesticide applicator license", "Category endorsements where required", "Continuing education"] }),
  makeTrade({ id: "landscaper", title: "Landscaper and Groundskeeper", category: "Agriculture & Natural Resources", subcategory: "Landscape", soc: "37-3011", nationalMedian: 40600, profile: "land", summary: "Maintains landscapes, lawns, plantings, hardscapes, irrigation, equipment, and outdoor spaces." }),
  makeTrade({ id: "arborist", title: "Arborist", category: "Agriculture & Natural Resources", subcategory: "Tree Care", nationalMedian: 52200, profile: "land", summary: "Prunes, removes, inspects, and cares for trees using climbing, rigging, saws, and plant health practices.", credentials: ["ISA Certified Arborist can help", "Pesticide license for treatments where required", "Line clearance training for utility work"] }),
  makeTrade({ id: "farm-equipment-mechanic", title: "Farm Equipment Mechanic", category: "Agriculture & Natural Resources", subcategory: "Equipment Repair", soc: "49-3041", nationalMedian: 52300, profile: "mechanical", summary: "Repairs tractors, harvesters, irrigation equipment, hydraulics, engines, and agricultural technology systems." }),
];

export const categories = Array.from(new Set(trades.map((trade) => trade.category))).sort();

export function findTrade(id?: string | null) {
  return trades.find((trade) => trade.id === id) || trades[0];
}

export function findState(code?: string | null) {
  return states.find((state) => state.code === code) || states.find((state) => state.code === "FL") || states[0];
}

export function estimateWage(trade: Trade, state: StateOption, city = "") {
  const largeMarketBoost = ["new york", "los angeles", "san jose", "seattle", "boston", "chicago", "denver", "miami", "san francisco"].some((market) =>
    city.toLowerCase().includes(market),
  )
    ? 1.08
    : city
      ? 1.02
      : 1;
  const median = Math.round((trade.nationalMedian * state.wageIndex * largeMarketBoost) / 100) * 100;
  return {
    source: "Planning estimate",
    year: "Local estimate until official data is connected",
    area: city ? `${city}, ${state.code}` : state.name,
    low: Math.round((median * 0.76) / 100) * 100,
    median,
    high: Math.round((median * 1.28) / 100) * 100,
  };
}
