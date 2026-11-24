import { HospitalEmergencyCode } from '../types';

export const HOSPITAL_EMERGENCY_CODES: HospitalEmergencyCode[] = [
  {
    code: 'CODE BLUE',
    name: 'Adult Medical Emergency / Cardiac Arrest',
    color: '#3b82f6',
    bgClass: 'bg-blue-600',
    borderClass: 'border-blue-400',
    textClass: 'text-blue-400',
    description: 'Imminent cardiac or respiratory arrest, loss of airway patency, or profound hemodynamic collapse in an adult patient.',
    urgency: 'critical',
    clinicalActionProtocol: [
      '1. Check responsiveness & central pulse (Carotid) for no more than 10 seconds.',
      '2. Shout for help and activate Hospital Code Blue button / call 2222.',
      '3. Initiate high-quality chest compressions immediately (100–120/min, 2–2.4 in depth).',
      '4. Attach defibrillator / manual monitor pads; analyze rhythm (Shockable: VF/VT; Non-shockable: PEA/Asystole).',
      '5. Secure airway with bag-valve-mask (100% O2) and establish IV/IO access for Epinephrine 1mg Q3-5min.',
      '6. Treat reversible causes (5 Hs & 5 Ts: Hypovolemia, Hypoxia, Hydrogen ion acidosis, Hypo/Hyperkalemia, Hypothermia, Tension pneumo, Tamponade, Toxins, Thrombosis PE/Coronary).'
    ],
  },
  {
    code: 'CODE RED',
    name: 'Fire / Visible Smoke or Thermal Hazard',
    color: '#ef4444',
    bgClass: 'bg-rose-600',
    borderClass: 'border-rose-400',
    textClass: 'text-rose-400',
    description: 'Active fire, visible smoke, or combustion hazard detected within hospital clinical wings or surgical suites.',
    urgency: 'critical',
    clinicalActionProtocol: [
      'R - RESCUE: Immediately move patients and individuals in immediate physical danger beyond fire doors.',
      'A - ALARM: Pull manual fire alarm pull-station and broadcast exact location to switchboard.',
      'C - CONFINE: Close all patient room doors, fire barriers, and windows to starve the fire of oxygen.',
      'E - EXTINGUISH / EVACUATE: If fire is small and safe, use PASS technique (Pull, Aim, Squeeze, Sweep) with CO2/Dry chemical extinguisher; otherwise evacuate horizontally behind fire barrier doors.',
      'Special: In ICU/OR, switch ventilated patients to portable O2 cylinders before closing zone oxygen shutoff valves.'
    ],
  },
  {
    code: 'CODE STEMI',
    name: 'Acute ST-Elevation Myocardial Infarction',
    color: '#f97316',
    bgClass: 'bg-orange-600',
    borderClass: 'border-orange-400',
    textClass: 'text-orange-400',
    description: 'Acute coronary occlusion with ST-segment elevation on 12-lead ECG. Goal: Door-to-Balloon time < 90 minutes.',
    urgency: 'critical',
    clinicalActionProtocol: [
      '1. Immediate STAT activation of Cardiac Catheterization Lab and Interventional Cardiologist on-call.',
      '2. Administer chewable Aspirin 325 mg PO immediately (if not already taken).',
      '3. Obtain second large-bore IV access; draw STAT troponin, CBC (Haemoglobin), electrolytes, PT/INR.',
      '4. Administer sublingual Nitroglycerin 0.4mg Q5min x3 (contraindicated if SBP <90 or RV infarction).',
      '5. Administer loading dose of P2Y12 inhibitor (Ticagrelor 180mg or Clopidogrel 600mg) and unfractionated Heparin.',
      '6. Transport patient directly to Cath Lab table within 30 minutes of presentation.'
    ],
  },
  {
    code: 'CODE SEPSIS',
    name: 'Severe Sepsis & Septic Shock Protocol',
    color: '#a855f7',
    bgClass: 'bg-purple-600',
    borderClass: 'border-purple-400',
    textClass: 'text-purple-400',
    description: 'Life-threatening organ dysfunction caused by a dysregulated host response to infection (qSOFA ≥ 2, hypotension, hyperlactatemia).',
    urgency: 'critical',
    clinicalActionProtocol: [
      '1. Measure serum lactate STAT (re-measure if initial lactate > 2 mmol/L).',
      '2. Obtain two sets of blood cultures (aerobic & anaerobic) PRIOR to initiating antimicrobials.',
      '3. Administer broad-spectrum empiric IV antibiotics within the FIRST HOUR of recognition.',
      '4. Rapid administration of 30 mL/kg IV balanced crystalloid (Plasmalyte or Normal Saline) for hypotension or lactate ≥ 4.',
      '5. Apply vasopressors (Norepinephrine first-choice) if patient remains hypotensive during or after fluid resuscitation to maintain MAP ≥ 65 mmHg.'
    ],
  },
  {
    code: 'CODE BLACK',
    name: 'Security Alert / Threat / Violent Situation',
    color: '#334155',
    bgClass: 'bg-slate-800',
    borderClass: 'border-slate-500',
    textClass: 'text-slate-300',
    description: 'Armed intruder, severe physical violence, hostage threat, or uncontrollable assaultive behavior endangering clinical personnel.',
    urgency: 'urgent',
    clinicalActionProtocol: [
      '1. Protect yourself and vulnerable patients; move behind secure locked badge-access doors.',
      '2. Do NOT attempt heroics or confront armed individuals directly.',
      '3. Quietly dial internal security / 911 with room number, description of individual, and weapons observed.',
      '4. Silence phones and pagers; remain in locked safe room until all-clear is broadcast by law enforcement.'
    ],
  },
  {
    code: 'CODE PINK',
    name: 'Pediatric Medical Emergency / Infant Abduction',
    color: '#ec4899',
    bgClass: 'bg-pink-600',
    borderClass: 'border-pink-400',
    textClass: 'text-pink-400',
    description: 'Missing infant/child, breached pediatric ward sensor, or acute pediatric resuscitation event.',
    urgency: 'urgent',
    clinicalActionProtocol: [
      '1. Staff immediately monitor all exterior doors, elevators, stairwells, and emergency exits.',
      '2. Observe all persons carrying duffel bags, oversized coats, or packages; challenge gently but firmly.',
      '3. If pediatric arrest: activate Broselow tape, pediatric defibrillator pads, weight-based resuscitation drugs.'
    ],
  },
  {
    code: 'CODE YELLOW',
    name: 'Internal Disaster / Vulnerable Patient Missing',
    color: '#eab308',
    bgClass: 'bg-amber-500',
    borderClass: 'border-amber-300',
    textClass: 'text-amber-300',
    description: 'Unaccounted vulnerable, confused, or cognitively impaired patient missing from bedside or major hospital infrastructure failure.',
    urgency: 'warning',
    clinicalActionProtocol: [
      '1. Search all bathrooms, utility closets, stairwells, cafeteria, and perimeter courtyard grounds.',
      '2. Secure hospital egress points and review badge access logs.',
      '3. Broadcast description, clothing, and high-risk medical alerts (e.g. insulin dependent, post-op).'
    ],
  },
  {
    code: 'CODE ORANGE',
    name: 'Hazardous Chemical / Radioactive Spill',
    color: '#ea580c',
    bgClass: 'bg-orange-700',
    borderClass: 'border-orange-500',
    textClass: 'text-orange-300',
    description: 'Toxic chemical release, biological biohazard breach, cytotoxic chemotherapy spill, or radiological contamination.',
    urgency: 'warning',
    clinicalActionProtocol: [
      '1. Evacuate immediate room / corridor; seal ventilation dampers if airborne vapor.',
      '2. Don appropriate PPE (Chemical-resistant apron, nitrile gloves, N95/P100 respirator, eye protection).',
      '3. Consult Safety Data Sheet (SDS) and deploy spill kit neutralizer pads.'
    ],
  },
];
