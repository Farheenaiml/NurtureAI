import os
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

DOCS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "documents")

GUIDELINES = {
    "who_pregnancy_nutrition_guidelines.pdf": """
    WHO Pregnancy Nutrition and Supplement Guidelines:
    
    1. Iron and Folic Acid Supplementation:
    WHO recommends daily oral iron and folic acid supplementation with 30 mg to 60 mg of elemental iron and 400 micrograms (0.4 mg) of folic acid for pregnant women to prevent maternal anaemia, puerperal sepsis, low birth weight, and preterm birth.
    Pairs iron-rich foods with vitamin C (like citrus fruits and bell peppers) to boost absorption significantly. Avoid tea and coffee during meals as they contain tannins that inhibit iron absorption.
    
    2. Calcium Supplementation:
    In populations with low dietary calcium intake, daily calcium supplementation (1.5g to 2.0g of elemental calcium) is recommended for pregnant women to reduce the risk of pre-eclampsia.
    
    3. Dietary Energy and Protein Intake:
    Healthy pregnant women should focus on nutrient-dense foods: lean proteins (chicken, fish, eggs, beans, lentils), whole grains (oats, brown rice, whole-wheat bread), and plenty of colorful fruits and vegetables. Avoid processed sugars and raw, unpasteurized dairy or undercooked meats.
    
    4. Caffeine Limits:
    For pregnant women with high daily caffeine intake (more than 300 mg per day), WHO recommends lowering daily caffeine intake to under 200 mg per day to reduce the risk of pregnancy loss and low birth weight. One cup of standard brewed coffee contains roughly 95 mg of caffeine.
    """,
    
    "cdc_pregnancy_milestones_guidelines.pdf": """
    CDC Pregnancy Development and Milestones Guidelines:
    
    1. Second Trimester Milestones (Weeks 13 to 27):
    At week 20, the baby is about the size of a banana, and fetal movements (quickening) are often felt for the first time.
    At week 24, the baby's lungs are forming surfactant, and the baby begins to develop sleep-wake cycles.
    
    2. Third Trimester Milestones (Weeks 28 to 40):
    At week 28, the baby's eyes are partially open, and eyelashes have formed. The baby's brain is growing rapidly, and they can perceive light and sound. Fetal movement counts (kick counts) should be tracked daily. A healthy baby should move at least 10 times within two hours.
    At week 36, the baby is gains weight rapidly (about half a pound per week). The space inside the uterus becomes tighter, and movement changes from sharp kicks to rolling or squirming.
    
    3. Safe Activities:
    Safe physical activities during pregnancy include brisk walking, swimming, prenatal yoga, and stationary cycling. Avoid contact sports, activities with a high risk of falling, or lying flat on your back for extended periods in the second and third trimesters.
    """,
    
    "acog_patient_symptom_discomforts.pdf": """
    ACOG Patient Education Guidelines: Common Pregnancy Discomforts and Symptoms
    
    1. Swollen Feet and Ankles (Edema):
    Swollen feet and ankles are common in pregnancy due to increased blood volume and pressure on the pelvic veins. Relief measures include elevating feet above heart level, wearing comfortable shoes, avoiding standing for long periods, staying hydrated, and wearing compression socks.
    
    2. Morning Sickness (Nausea and Vomiting):
    Affects up to 80% of pregnant women, primarily in the first trimester. Recommendations include eating small, frequent meals, keeping dry crackers by the bed, avoiding greasy or spicy foods, taking ginger supplements (up to 1g per day), and vitamin B6 (pyridoxine) therapy.
    
    3. Back Pain:
    Common due to center-of-gravity shifts and hormone relaxin loosening ligaments. Remedies include practicing good posture, wearing supportive flat shoes, using a pregnancy pillow for sleeping on the side, applying warm compresses, and doing gentle stretches.
    
    4. When Discomfort is a Red Flag:
    Mild swelling or nausea is normal. However, sudden severe swelling in the hands or face, accompanied by severe headache or vision changes, can be a sign of pre-eclampsia and requires immediate evaluation.
    """,
    
    "who_postnatal_care_mental_health.pdf": """
    WHO Postnatal Care Guidelines: Maternal Wellbeing and Postpartum Support
    
    1. Postpartum Mental Health (Baby Blues vs Postpartum Depression):
    The 'baby blues' are common, affecting up to 80% of mothers in the first two weeks, involving mild mood changes and crying spells. It usually resolves without treatment.
    Postpartum Depression (PPD) is a serious medical condition affecting 10-15% of mothers, involving persistent sadness, severe anxiety, extreme fatigue, difficulty bonding with the baby, and feelings of worthlessness. WHO recommends screening all mothers for PPD at postpartum checkups (typically at 6 weeks).
    
    2. Support and Recovery:
    Ensure adequate rest, accept help from family/friends, and engage in light physical activity when cleared by a doctor. Counseling, support groups, and cognitive behavioral therapy are highly effective first-line treatments for PPD.
    
    3. Newborn Care and Bonding:
    Skin-to-skin contact immediately after birth and during the early weeks promotes bonding, regulates the baby's temperature, and supports breastfeeding initiation.
    """,
    
    "who_breastfeeding_guidelines.pdf": """
    WHO Infant Feeding and Breastfeeding Guidelines:
    
    1. Exclusive Breastfeeding:
    WHO recommends that infants should be exclusively breastfed for the first six months of life to achieve optimal growth, development, and health. No water, formula, or other foods should be given unless medically indicated.
    
    2. Initiation of Breastfeeding:
    Initiate breastfeeding within the first hour of birth. Skin-to-skin contact immediately after delivery stimulates the release of prolactin and oxytocin, which helps with early milk letdown.
    
    3. Colostrum:
    The early thick yellow milk (colostrum) produced in the first few days is rich in antibodies, proteins, and immune factors. It acts as the baby's first natural vaccine and should never be discarded.
    
    4. Latch and Positioning:
    A good latch is critical to prevent nipple pain and ensure efficient milk transfer. The baby's mouth should be wide open, with the lower lip flanged outward, covering most of the areola (not just the nipple).
    """,
    
    "emergency_severe_warning_signs.pdf": """
    CDC and ACOG Urgent Maternal Warning Signs and Emergencies:
    
    1. Severe Bleeding:
    Bleeding that saturates a sanitary pad in an hour or passing blood clots larger than a quarter requires immediate emergency medical evaluation.
    
    2. Severe Abdominal or Chest Pain:
    Sharp, sudden, or persistent pain in the chest, breathing difficulties, or severe cramps in the stomach/abdomen can indicate emergencies like pulmonary embolism, ectopic pregnancy, pre-eclampsia, or placental abruption.
    
    3. Pre-eclampsia Flags:
    Sudden severe swelling of the face, hands, or eyes, accompanied by a persistent splitting headache, blurry vision, flashing lights, or pain in the upper right abdomen.
    
    4. Reduced Fetal Movement:
    A significant decrease or sudden stoppage of baby movement (fewer than 10 kicks in 2 hours) in the third trimester requires immediate fetal monitoring at a clinic or hospital. Do not wait for the next day.
    
    5. Loss of Consciousness or Seizures:
    Any fainting spells, extreme dizziness, or seizures require calling an ambulance immediately.
    """
}

def generate_pdfs():
    if not os.path.exists(DOCS_DIR):
        os.makedirs(DOCS_DIR)
        
    print(f"Generating {len(GUIDELINES)} sample maternal guidelines PDFs inside: {DOCS_DIR}")
    
    styles = getSampleStyleSheet()
    normal_style = styles["Normal"]
    
    for filename, content in GUIDELINES.items():
        file_path = os.path.join(DOCS_DIR, filename)
        doc = SimpleDocTemplate(file_path, pagesize=letter)
        
        story = []
        lines = content.strip().split("\n")
        
        for line in lines:
            if line.strip():
                p = Paragraph(line.strip(), normal_style)
                story.append(p)
                story.append(Spacer(1, 10))
                
        doc.build(story)
        print(f"Successfully generated PDF: {filename}")

if __name__ == "__main__":
    generate_pdfs()
