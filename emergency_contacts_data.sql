-- Emergency Contacts Database for India - Complete Department Directory
-- Insert comprehensive emergency contact information for all departments

-- National Emergency Numbers
INSERT INTO emergency_contacts (name, phone, email, department, category, state, district, is_active) VALUES
-- Primary Emergency Services
('National Emergency Helpline', '112', 'emergency@gov.in', 'Emergency Services', 'emergency', 'National', 'All', true),
('Police Emergency', '100', 'police@gov.in', 'Police', 'emergency', 'National', 'All', true),
('Fire Brigade', '101', 'fire@gov.in', 'Fire Services', 'emergency', 'National', 'All', true),
('Ambulance Services', '108', 'ambulance@nhm.gov.in', 'Medical Emergency', 'emergency', 'National', 'All', true),
('Disaster Management', '108', 'ndma@nic.in', 'NDMA', 'emergency', 'National', 'All', true),

-- National Disaster Management Authority (NDMA)
('NDMA Control Room', '+91-11-26701700', 'ndma@nic.in', 'NDMA', 'disaster', 'National', 'All', true),
('NDMA Emergency Operations', '+91-11-26701728', 'eoc.ndma@nic.in', 'NDMA', 'disaster', 'National', 'All', true),

-- Central Water Commission
('CWC Flood Forecasting', '+91-11-24365969', 'ceo-cwc@nic.in', 'Central Water Commission', 'flood', 'National', 'All', true),
('CWC Emergency Cell', '+91-11-24365292', 'floods.cwc@nic.in', 'Central Water Commission', 'flood', 'National', 'All', true),

-- India Meteorological Department
('IMD Weather Emergency', '+91-11-24629798', 'dgimd@imd.gov.in', 'IMD', 'weather', 'National', 'All', true),
('IMD Cyclone Warning', '+91-11-24621220', 'cyclone@imd.gov.in', 'IMD', 'weather', 'National', 'All', true),

-- Maharashtra State Contacts
('Maharashtra SDMA', '+91-22-22027990', 'ceo.maharashtra@nic.in', 'State Disaster Management', 'disaster', 'Maharashtra', 'All', true),
('Mumbai Police Control', '+91-22-22621855', 'cp@mumbaipolice.gov.in', 'Police', 'emergency', 'Maharashtra', 'Mumbai', true),
('Mumbai Fire Brigade', '+91-22-23071111', 'fire@mcgm.gov.in', 'Fire Services', 'emergency', 'Maharashtra', 'Mumbai', true),
('BMC Disaster Cell', '+91-22-22694725', 'disaster@mcgm.gov.in', 'Municipal Corporation', 'disaster', 'Maharashtra', 'Mumbai', true),

-- Delhi State Contacts
('Delhi Police Control', '+91-11-24692100', 'cp@delhipolice.nic.in', 'Police', 'emergency', 'Delhi', 'New Delhi', true),
('Delhi Fire Service', '+91-11-23221000', 'cfo@delhi.gov.in', 'Fire Services', 'emergency', 'Delhi', 'New Delhi', true),
('DDMA Delhi', '+91-11-23392358', 'ceo-ddma@nic.in', 'District Disaster Management', 'disaster', 'Delhi', 'New Delhi', true),

-- Karnataka State Contacts
('Karnataka SDMA', '+91-80-22340676', 'secy-rdpr@karnataka.gov.in', 'State Disaster Management', 'disaster', 'Karnataka', 'All', true),
('Bangalore Police Control', '+91-80-22942000', 'cp@ksp.gov.in', 'Police', 'emergency', 'Karnataka', 'Bangalore', true),
('Bangalore Fire Service', '+91-80-22221000', 'fire@bbmp.gov.in', 'Fire Services', 'emergency', 'Karnataka', 'Bangalore', true),

-- Tamil Nadu State Contacts
('Tamil Nadu SDMA', '+91-44-28524491', 'ceo-tn@nic.in', 'State Disaster Management', 'disaster', 'Tamil Nadu', 'All', true),
('Chennai Police Control', '+91-44-23452000', 'cp@tnpolice.gov.in', 'Police', 'emergency', 'Tamil Nadu', 'Chennai', true),
('Chennai Fire Service', '+91-44-28520111', 'fire@chennaicorporation.gov.in', 'Fire Services', 'emergency', 'Tamil Nadu', 'Chennai', true),

-- West Bengal State Contacts
('West Bengal SDMA', '+91-33-22145019', 'ceo-wb@nic.in', 'State Disaster Management', 'disaster', 'West Bengal', 'All', true),
('Kolkata Police Control', '+91-33-22144444', 'cp@kolkatapolice.gov.in', 'Police', 'emergency', 'West Bengal', 'Kolkata', true),
('Kolkata Fire Service', '+91-33-22440101', 'fire@kmcgov.in', 'Fire Services', 'emergency', 'West Bengal', 'Kolkata', true),

-- Uttar Pradesh State Contacts
('UP SDMA', '+91-522-2623652', 'ceo-up@nic.in', 'State Disaster Management', 'disaster', 'Uttar Pradesh', 'All', true),
('Lucknow Police Control', '+91-522-2612000', 'cp@up.gov.in', 'Police', 'emergency', 'Uttar Pradesh', 'Lucknow', true),
('UP Fire Service', '+91-522-2612555', 'fire@up.gov.in', 'Fire Services', 'emergency', 'Uttar Pradesh', 'Lucknow', true),

-- Gujarat State Contacts
('Gujarat SDMA', '+91-79-23254802', 'ceo-guj@nic.in', 'State Disaster Management', 'disaster', 'Gujarat', 'All', true),
('Ahmedabad Police Control', '+91-79-26851000', 'cp@gujaratpolice.gov.in', 'Police', 'emergency', 'Gujarat', 'Ahmedabad', true),
('Gujarat Fire Service', '+91-79-25506000', 'fire@gujarat.gov.in', 'Fire Services', 'emergency', 'Gujarat', 'Ahmedabad', true),

-- Rajasthan State Contacts
('Rajasthan SDMA', '+91-141-2227475', 'ceo-raj@nic.in', 'State Disaster Management', 'disaster', 'Rajasthan', 'All', true),
('Jaipur Police Control', '+91-141-2744000', 'cp@rajasthanpolice.gov.in', 'Police', 'emergency', 'Rajasthan', 'Jaipur', true),
('Rajasthan Fire Service', '+91-141-2411111', 'fire@rajasthan.gov.in', 'Fire Services', 'emergency', 'Rajasthan', 'Jaipur', true),

-- Madhya Pradesh State Contacts
('MP SDMA', '+91-755-2441211', 'ceo-mp@nic.in', 'State Disaster Management', 'disaster', 'Madhya Pradesh', 'All', true),
('Bhopal Police Control', '+91-755-2778100', 'cp@mppolice.gov.in', 'Police', 'emergency', 'Madhya Pradesh', 'Bhopal', true),
('MP Fire Service', '+91-755-2660111', 'fire@mp.gov.in', 'Fire Services', 'emergency', 'Madhya Pradesh', 'Bhopal', true),

-- Andhra Pradesh State Contacts
('AP SDMA', '+91-40-23454592', 'ceo-ap@nic.in', 'State Disaster Management', 'disaster', 'Andhra Pradesh', 'All', true),
('Hyderabad Police Control', '+91-40-27853333', 'cp@hyderabadpolice.gov.in', 'Police', 'emergency', 'Andhra Pradesh', 'Hyderabad', true),
('AP Fire Service', '+91-40-23454545', 'fire@ap.gov.in', 'Fire Services', 'emergency', 'Andhra Pradesh', 'Hyderabad', true),

-- Telangana State Contacts
('Telangana SDMA', '+91-40-23454800', 'ceo-tg@nic.in', 'State Disaster Management', 'disaster', 'Telangana', 'All', true),
('Telangana Police Control', '+91-40-27852000', 'cp@tspolice.gov.in', 'Police', 'emergency', 'Telangana', 'Hyderabad', true),

-- Kerala State Contacts
('Kerala SDMA', '+91-471-2518480', 'ceo-kl@nic.in', 'State Disaster Management', 'disaster', 'Kerala', 'All', true),
('Thiruvananthapuram Police', '+91-471-2721547', 'cp@keralapolice.gov.in', 'Police', 'emergency', 'Kerala', 'Thiruvananthapuram', true),
('Kerala Fire Service', '+91-471-2518101', 'fire@kerala.gov.in', 'Fire Services', 'emergency', 'Kerala', 'Thiruvananthapuram', true),

-- Punjab State Contacts
('Punjab SDMA', '+91-172-2864916', 'ceo-pb@nic.in', 'State Disaster Management', 'disaster', 'Punjab', 'All', true),
('Chandigarh Police Control', '+91-172-2740185', 'cp@punjabpolice.gov.in', 'Police', 'emergency', 'Punjab', 'Chandigarh', true),
('Punjab Fire Service', '+91-172-2749911', 'fire@punjab.gov.in', 'Fire Services', 'emergency', 'Punjab', 'Chandigarh', true),

-- Haryana State Contacts
('Haryana SDMA', '+91-172-2560344', 'ceo-hr@nic.in', 'State Disaster Management', 'disaster', 'Haryana', 'All', true),
('Gurgaon Police Control', '+91-124-2346100', 'cp@haryanapolice.gov.in', 'Police', 'emergency', 'Haryana', 'Gurgaon', true),
('Haryana Fire Service', '+91-172-2560101', 'fire@haryana.gov.in', 'Fire Services', 'emergency', 'Haryana', 'Gurgaon', true),

-- Bihar State Contacts
('Bihar SDMA', '+91-612-2232294', 'ceo-br@nic.in', 'State Disaster Management', 'disaster', 'Bihar', 'All', true),
('Patna Police Control', '+91-612-2219100', 'cp@biharpolice.gov.in', 'Police', 'emergency', 'Bihar', 'Patna', true),
('Bihar Fire Service', '+91-612-2675555', 'fire@bihar.gov.in', 'Fire Services', 'emergency', 'Bihar', 'Patna', true),

-- Jharkhand State Contacts
('Jharkhand SDMA', '+91-651-2446379', 'ceo-jh@nic.in', 'State Disaster Management', 'disaster', 'Jharkhand', 'All', true),
('Ranchi Police Control', '+91-651-2401234', 'cp@jhpolice.gov.in', 'Police', 'emergency', 'Jharkhand', 'Ranchi', true),
('Jharkhand Fire Service', '+91-651-2401010', 'fire@jharkhand.gov.in', 'Fire Services', 'emergency', 'Jharkhand', 'Ranchi', true),

-- Odisha State Contacts
('Odisha SDMA', '+91-674-2536988', 'ceo-or@nic.in', 'State Disaster Management', 'disaster', 'Odisha', 'All', true),
('Bhubaneswar Police Control', '+91-674-2511349', 'cp@odishapolice.gov.in', 'Police', 'emergency', 'Odisha', 'Bhubaneswar', true),
('Odisha Fire Service', '+91-674-2534816', 'fire@odisha.gov.in', 'Fire Services', 'emergency', 'Odisha', 'Bhubaneswar', true),

-- Chhattisgarh State Contacts
('Chhattisgarh SDMA', '+91-771-2443498', 'ceo-cg@nic.in', 'State Disaster Management', 'disaster', 'Chhattisgarh', 'All', true),
('Raipur Police Control', '+91-771-2422100', 'cp@cgpolice.gov.in', 'Police', 'emergency', 'Chhattisgarh', 'Raipur', true),
('CG Fire Service', '+91-771-2511111', 'fire@cg.gov.in', 'Fire Services', 'emergency', 'Chhattisgarh', 'Raipur', true),

-- Assam State Contacts
('Assam SDMA', '+91-361-2237617', 'ceo-as@nic.in', 'State Disaster Management', 'disaster', 'Assam', 'All', true),
('Guwahati Police Control', '+91-361-2440307', 'cp@assampolice.gov.in', 'Police', 'emergency', 'Assam', 'Guwahati', true),
('Assam Fire Service', '+91-361-2540101', 'fire@assam.gov.in', 'Fire Services', 'emergency', 'Assam', 'Guwahati', true),

-- Specialized Emergency Services
('Women Helpline', '1091', 'women@nic.in', 'Women Safety', 'emergency', 'National', 'All', true),
('Child Helpline', '1098', 'child@nic.in', 'Child Protection', 'emergency', 'National', 'All', true),
('Senior Citizen Helpline', '14567', 'senior@nic.in', 'Senior Citizens', 'emergency', 'National', 'All', true),
('Tourist Helpline', '1363', 'tourist@incredibleindia.org', 'Tourism', 'emergency', 'National', 'All', true),
('Railway Accident Emergency', '1512', 'railway@nic.in', 'Railway', 'emergency', 'National', 'All', true),
('Road Accident Emergency', '1073', 'road@nic.in', 'Road Transport', 'emergency', 'National', 'All', true),

-- Medical Emergency Centers
('AIIMS Emergency Delhi', '+91-11-26588500', 'director@aiims.ac.in', 'Medical Emergency', 'medical', 'Delhi', 'New Delhi', true),
('AIIMS Emergency Mumbai', '+91-22-26767777', 'director@aiimsmumbai.edu.in', 'Medical Emergency', 'medical', 'Maharashtra', 'Mumbai', true),
('AIIMS Emergency Bangalore', '+91-80-26699721', 'director@aiimsbangalore.edu.in', 'Medical Emergency', 'medical', 'Karnataka', 'Bangalore', true),
('AIIMS Emergency Chennai', '+91-44-26158500', 'director@aiimschennai.edu.in', 'Medical Emergency', 'medical', 'Tamil Nadu', 'Chennai', true),

-- Flood-Specific Emergency Contacts
('Central Flood Control Room', '+91-11-24365969', 'flood@cwc.gov.in', 'Flood Control', 'flood', 'National', 'All', true),
('Maharashtra Flood Control', '+91-22-22027455', 'flood@maharashtra.gov.in', 'Flood Control', 'flood', 'Maharashtra', 'All', true),
('Kerala Flood Control', '+91-471-2518456', 'flood@kerala.gov.in', 'Flood Control', 'flood', 'Kerala', 'All', true),
('Assam Flood Control', '+91-361-2237890', 'flood@assam.gov.in', 'Flood Control', 'flood', 'Assam', 'All', true),
('West Bengal Flood Control', '+91-33-22145067', 'flood@wb.gov.in', 'Flood Control', 'flood', 'West Bengal', 'All', true),
('Bihar Flood Control', '+91-612-2232567', 'flood@bihar.gov.in', 'Flood Control', 'flood', 'Bihar', 'All', true),
('Uttar Pradesh Flood Control', '+91-522-2623890', 'flood@up.gov.in', 'Flood Control', 'flood', 'Uttar Pradesh', 'All', true);
