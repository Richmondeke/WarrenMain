
import json
import os
import requests
from tqdm import tqdm
from dotenv import load_dotenv

# Load env from .env.local
load_dotenv('.env.local')

class FirestoreREST:
    def __init__(self):
        self.project_id = os.getenv("NEXT_PUBLIC_FIREBASE_PROJECT_ID")
        self.api_key = os.getenv("NEXT_PUBLIC_FIREBASE_API_KEY")
        self.base_url = f"https://firestore.googleapis.com/v1/projects/{self.project_id}/databases/(default)/documents"

    def patch_document(self, collection, doc_id, data):
        url = f"{self.base_url}/{collection}/{doc_id}?key={self.api_key}"
        
        # Build Firestore-friendly fields
        fields = {}
        for k, v in data.items():
            if isinstance(v, str):
                fields[k] = {"stringValue": v}
            elif isinstance(v, bool):
                fields[k] = {"booleanValue": v}
            elif isinstance(v, (int, float)):
                fields[k] = {"doubleValue": float(v)}
            elif isinstance(v, list):
                fields[k] = {"arrayValue": {"values": [{"stringValue": str(x)} for x in v]}}
            elif isinstance(v, dict):
                # Simple dict handling (for socials)
                sub_fields = {}
                for sk, sv in v.items():
                    sub_fields[sk] = {"stringValue": str(sv)}
                fields[k] = {"mapValue": {"fields": sub_fields}}

        payload = {"fields": fields}
        update_mask = "&".join([f"updateMask.fieldPaths={k}" for k in data.keys()])
        url += f"&{update_mask}"

        try:
            res = requests.patch(url, json=payload, timeout=10)
            res.raise_for_status()
            return res.json()
        except Exception as e:
            print(f"Error patching {doc_id}: {e}")
            return None

# Manual Data Mapping
MANUAL_UPDATES = {
    "dfs-20lab": {
        "description": "DFS Lab is a research-driven venture capital firm that focuses on early-stage investments in the African digital commerce and financial services sectors. The firm utilizes deep institutional and academic research to guide its investment decisions, supporting startups integrating digital solutions with existing informal networks.",
    },
    "synergy-capital-ma---": {
        "name": "Synergy Capital Managers",
        "description": "Synergy Capital Managers is a Nigeria-based private equity firm that targets expansion and growth equity investments within Anglophone West Africa. Focusing on medium-sized companies in high-growth sectors such as agro-processing, ICT, consumer services, energy, and power.",
    },
    "adlevo-20capital": {
        "description": "Adlevo Capital is a private equity fund manager founded on the belief that meaningful development in sub-Saharan Africa will be driven by the application of technology to business processes. The firm makes equity investments in high-growth companies in fintech and healthcare.",
    },
    "alitheia-20capital": {
        "description": "Alitheia Capital is a pioneering impact-investing private equity firm based in Lagos, Nigeria. The firm focuses on backing high-potential small and medium-sized enterprises (SMEs) that enhance access to essential goods and services for underserved populations across Africa.",
    },
    "mest-20africa": {
        "description": "MEST Africa is a pan-African tech-entrepreneurship training program, seed fund, and incubator. Founded by the Meltwater Foundation, it equips emerging talent with the skills needed to build and scale globally successful software companies.",
    },
    "v8-20capital-20partners": {
        "description": "V8 Capital Partners is an African venture capital firm established to back visionary entrepreneurs who utilize technology to drive enterprise automation. The firm invests primarily in data-centric services across sectors like fintech, healthcare, and agtech.",
    },
    "leapfrog-20investments": {
        "description": "Leapfrog Investments is a global impact-investing firm that partners with high-growth financial services, healthcare, and climate solutions companies across Africa and Asia, seeking to generate strong financial returns alongside social impact.",
    },
    "gray-20matters-20capital": {
        "description": "Gray Matters Capital is an impact investment firm dedicated to empowering communities in the global south, with a deep focus on education finance, skill development, and gender-lens investing to help women achieve economic independence.",
    },
    "frontier-20digital-20ventures": {
        "description": "Frontier Digital Ventures specializing in owning and operating online classifieds marketplaces across emerging markets. The firm works closely with local management teams to provide strategic oversight in property, automotive, and general verticals.",
    },
    "vu-20venture-20partners": {
        "description": "VU Venture Partners is a global multi-stage venture capital firm focused on Consumer, Enterprise, Fintech, Frontier, Healthcare, & PropTech, integrating a unique platform with the Venture University accelerator.",
    },
    "sumara-venture-stu---": {
        "name": "Sumara Venture Studio",
        "description": "Sumara Venture Studio is a West African venture-building studio focused on supporting women-led ventures in healthtech, fintech, and agritech by acting as a co-founder and strategic partner.",
    },
    "praxis": {
        "description": "Praxis is a venture-building ecosystem focused on redemptive entrepreneurship. It works with founders and funders motivated by their faith to address major global challenges through redemptive imagination.",
    },
    "sunu-20capital": {
        "description": "Sunu Capital is an early-stage venture capital firm that focuses on investing in high-growth startups across the global south, with a strong emphasis on fintech, logistics, agriculture, and healthcare.",
    },
    "jaof-20rahou": {
        "description": "Jaof Rahou is an active business angel investor specializing in strategic insights, operational expertise, and digital transformation for startups across major African tech hubs including Nigeria, Ghana, and Kenya.",
    },
    "babajide-20tella": {
        "description": "Babajide Tella is a mission-driven angel investor and Global HR leader at Meta. He leverages extensive experience in organizational design and leadership development to support early-stage startups solving high-impact problems across Africa.",
    },
    "w-20fund": {
        "description": "W Fund is an early-stage venture capital firm dedicated to supporting overlooked and underrepresented founders, with a specific mandate to fund women-led startups in fintech, AI, and edtech.",
    },
    "blue-20haven-20initiative": {
        "description": "Blue Haven Initiative is a pioneering family office and impact investment organization that invests across climate, financial services, and mental health sectors to achieve market-rate returns alongside environmental and social change.",
    },
    "acumen-20resilient-20agriculture-20fund": {
        "description": "Acumen Resilient Agriculture Fund (ARAF) is a $58 million impact-driven equity fund designed to build the climate resilience of smallholder farmers in Africa by investing in innovative agribusinesses.",
    },
    "peninsula-20capital": {
        "name": "Peninsula Capital Partners",
        "description": "Peninsula Capital Partners provides structured-capital, mezzanine, and equity funding solutions for middle-market businesses across a wide range of industries, specializing in customized financial solutions.",
    },
    "otv": {
        "description": "OTV is a global venture capital firm specializing in digital health. It backs disruptive innovations in telemedicine, genomics, and AI-driven health platforms to improve and save lives.",
    },
    "skoll-20foundation": {
        "description": "The Skoll Foundation is dedicated to driving large-scale social change by investing in, connecting, and celebrating social entrepreneurs who are tackling the world's most pressing problems, including climate change and public health.",
    },
    "end-poverty--make----": {
        "name": "End Poverty Make It Happen",
        "description": "End Poverty is a global economic development organization that supports micro-entrepreneurs in developing countries through a model of capital, coaching, and community support.",
    },
    "arise-pty-ltd": {
        "description": "Arise is a leading African boutique investment company focused on sustainable, locally owned financial service providers in Sub-Saharan Africa, aiming to foster financial inclusion and economic growth.",
    },
    "pcg-investments": {
        "description": "PCG Investments focuses on social impact and impact investing, utilizing capital to address pressing global issues while ensuring sustainable growth and community empowerment.",
    },
    "global-social-impa---": {
        "name": "Global Social Impact",
        "description": "Global Social Impact is a trusted advisor and intermediary driving strategic philanthropy and social impact finance to address global environmental and social challenges.",
    },
    "first-national-ban---": {
        "name": "First National Bank Ghana",
        "description": "First National Bank Ghana is a leading commercial bank that actively supports the tech ecosystem through banking, lending, and payments solutions for high-growth businesses and entrepreneurs.",
    },
    "fastforward-u": {
        "description": "FastForward U is the primary hub for student entrepreneurship at Johns Hopkins University, providing resources, accelerators, and maker labs to support students as they build sustainable and investor-ready ventures.",
    },
    "george-20mwenda": {
        "description": "George Mwenda is a fintech-focused business strategist and investor with deep expertise in customer value management and telecommunications, supporting early-stage tech startups across East and West Africa.",
    }
}

def main():
    db = FirestoreREST()
    json_path = 'public/warren_enriched.json'
    
    with open(json_path, 'r') as f:
        investors = json.load(f)

    updated_count = 0
    for inv in tqdm(investors, desc="Applying manual enrichment"):
        if inv['id'] in MANUAL_UPDATES:
            updates = MANUAL_UPDATES[inv['id']]
            inv.update(updates)
            
            # Sync to Firestore
            db.patch_document("investors", inv['id'], updates)
            updated_count += 1

    # Save local JSON
    with open(json_path, 'w') as f:
        json.dump(investors, f, indent=2)

    print(f"\nSuccessfully applied updates to {updated_count} records.")

if __name__ == "__main__":
    main()
