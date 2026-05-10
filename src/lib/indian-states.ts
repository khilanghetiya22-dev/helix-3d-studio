// Indian States, Union Territories, and their major cities
// Used in the order form address section

export interface StateEntry {
  name: string;
  type: 'state' | 'ut';
  cities: string[];
}

export const INDIAN_STATES: StateEntry[] = [
  // States (28)
  { name: 'Andhra Pradesh', type: 'state', cities: ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Kurnool', 'Tirupati', 'Kakinada', 'Rajahmundry', 'Kadapa', 'Anantapur'] },
  { name: 'Arunachal Pradesh', type: 'state', cities: ['Itanagar', 'Naharlagun', 'Pasighat', 'Tawang', 'Ziro'] },
  { name: 'Assam', type: 'state', cities: ['Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat', 'Nagaon', 'Tinsukia', 'Tezpur', 'Bongaigaon'] },
  { name: 'Bihar', type: 'state', cities: ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Purnia', 'Darbhanga', 'Bihar Sharif', 'Arrah', 'Begusarai'] },
  { name: 'Chhattisgarh', type: 'state', cities: ['Raipur', 'Bhilai', 'Bilaspur', 'Korba', 'Durg', 'Rajnandgaon', 'Jagdalpur'] },
  { name: 'Goa', type: 'state', cities: ['Panaji', 'Margao', 'Vasco da Gama', 'Mapusa', 'Ponda'] },
  { name: 'Gujarat', type: 'state', cities: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar', 'Junagadh', 'Gandhinagar', 'Anand', 'Nadiad'] },
  { name: 'Haryana', type: 'state', cities: ['Faridabad', 'Gurugram', 'Panipat', 'Ambala', 'Yamunanagar', 'Rohtak', 'Hisar', 'Karnal', 'Sonipat', 'Panchkula'] },
  { name: 'Himachal Pradesh', type: 'state', cities: ['Shimla', 'Manali', 'Dharamshala', 'Solan', 'Mandi', 'Kullu', 'Hamirpur', 'Baddi'] },
  { name: 'Jharkhand', type: 'state', cities: ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro', 'Deoghar', 'Phusro', 'Hazaribagh', 'Giridih'] },
  { name: 'Karnataka', type: 'state', cities: ['Bengaluru', 'Mysuru', 'Mangaluru', 'Hubli', 'Dharwad', 'Belagavi', 'Kalaburagi', 'Ballari', 'Davangere', 'Shivamogga'] },
  { name: 'Kerala', type: 'state', cities: ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Kollam', 'Palakkad', 'Alappuzha', 'Malappuram', 'Kannur', 'Kasaragod'] },
  { name: 'Madhya Pradesh', type: 'state', cities: ['Bhopal', 'Indore', 'Jabalpur', 'Gwalior', 'Ujjain', 'Sagar', 'Dewas', 'Satna', 'Ratlam', 'Rewa'] },
  { name: 'Maharashtra', type: 'state', cities: ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad', 'Solapur', 'Amravati', 'Kolhapur', 'Thane', 'Navi Mumbai'] },
  { name: 'Manipur', type: 'state', cities: ['Imphal', 'Thoubal', 'Bishnupur', 'Churachandpur'] },
  { name: 'Meghalaya', type: 'state', cities: ['Shillong', 'Tura', 'Jowai', 'Nongpoh'] },
  { name: 'Mizoram', type: 'state', cities: ['Aizawl', 'Lunglei', 'Champhai', 'Serchhip'] },
  { name: 'Nagaland', type: 'state', cities: ['Kohima', 'Dimapur', 'Mokokchung', 'Wokha', 'Tuensang'] },
  { name: 'Odisha', type: 'state', cities: ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Berhampur', 'Sambalpur', 'Puri', 'Balasore', 'Baripada'] },
  { name: 'Punjab', type: 'state', cities: ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda', 'Mohali', 'Hoshiarpur', 'Pathankot', 'Moga'] },
  { name: 'Rajasthan', type: 'state', cities: ['Jaipur', 'Jodhpur', 'Kota', 'Bikaner', 'Ajmer', 'Udaipur', 'Bhilwara', 'Alwar', 'Sikar', 'Bharatpur'] },
  { name: 'Sikkim', type: 'state', cities: ['Gangtok', 'Namchi', 'Mangan', 'Gyalshing'] },
  { name: 'Tamil Nadu', type: 'state', cities: ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli', 'Erode', 'Vellore', 'Thoothukudi', 'Tiruppur'] },
  { name: 'Telangana', type: 'state', cities: ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Khammam', 'Ramagundam', 'Mahbubnagar', 'Nalgonda'] },
  { name: 'Tripura', type: 'state', cities: ['Agartala', 'Udaipur', 'Dharmanagar', 'Kailashahar'] },
  { name: 'Uttar Pradesh', type: 'state', cities: ['Lucknow', 'Kanpur', 'Agra', 'Varanasi', 'Prayagraj', 'Ghaziabad', 'Noida', 'Meerut', 'Bareilly', 'Aligarh'] },
  { name: 'Uttarakhand', type: 'state', cities: ['Dehradun', 'Haridwar', 'Roorkee', 'Haldwani', 'Rudrapur', 'Rishikesh', 'Kashipur', 'Nainital'] },
  { name: 'West Bengal', type: 'state', cities: ['Kolkata', 'Asansol', 'Siliguri', 'Durgapur', 'Bardhaman', 'Malda', 'Baharampur', 'Howrah', 'Hooghly'] },

  // Union Territories (8)
  { name: 'Andaman and Nicobar Islands', type: 'ut', cities: ['Port Blair', 'Diglipur', 'Rangat'] },
  { name: 'Chandigarh', type: 'ut', cities: ['Chandigarh'] },
  { name: 'Dadra and Nagar Haveli and Daman and Diu', type: 'ut', cities: ['Silvassa', 'Daman', 'Diu'] },
  { name: 'Delhi (NCT)', type: 'ut', cities: ['New Delhi', 'Dwarka', 'Rohini', 'Pitampura', 'Laxmi Nagar', 'Janakpuri', 'Shahdara', 'Noida Extension'] },
  { name: 'Jammu and Kashmir', type: 'ut', cities: ['Srinagar', 'Jammu', 'Anantnag', 'Baramulla', 'Sopore', 'Kathua'] },
  { name: 'Ladakh', type: 'ut', cities: ['Leh', 'Kargil'] },
  { name: 'Lakshadweep', type: 'ut', cities: ['Kavaratti', 'Agatti', 'Andrott'] },
  { name: 'Puducherry', type: 'ut', cities: ['Puducherry', 'Karaikal', 'Mahe', 'Yanam'] },
];

/**
 * Get cities for a given state/UT name
 */
export function getCitiesForState(stateName: string): string[] {
  const entry = INDIAN_STATES.find(s => s.name === stateName);
  return entry?.cities || [];
}

/**
 * Validate Indian pincode (exactly 6 digits)
 */
export function isValidPincode(pincode: string): boolean {
  return /^\d{6}$/.test(pincode);
}
