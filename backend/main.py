import json
from datetime import datetime

from utils.pdf_extractor import extract_pdf_text
from utils.analyzer import analyze_regulation
from utils.gap_detector import (
    load_existing_policies,
    identify_gaps
)

# ============ EXECUTION ============
if __name__ == "__main__":
    try:
        print("=" * 60)
        print("NLP-JURIST: Compliance Gap Analyzer")
        print(f"Execution Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("=" * 60)
        
        # Step 1: Extract regulation text
        print("\n[1/4] Extracting text from PDF...")
        regulation_text = extract_pdf_text("data/sample.pdf")
        print(f"[OK] Extracted {len(regulation_text)} characters")
        
        # Step 2: Analyze regulation
        print("\n[2/4] Analyzing regulation with RAG...")
        regulation_analysis = analyze_regulation(regulation_text)
        print(f"[OK] Analysis complete")
        print(f"  - Risk Level: {regulation_analysis.get('risk_level')}")
        print(f"  - Deadline: {regulation_analysis.get('deadline')}")
        print(f"  - Action Points: {len(regulation_analysis.get('measurable_action_points', []))}")
        
        # Step 3: Load existing policies
        print("\n[3/4] Loading existing bank policies...")
        existing_policies = load_existing_policies()
        print(f"[OK] Loaded {len(existing_policies.get('policies', []))} existing policies")
        
        # Step 4: Identify gaps
        print("\n[4/4] Identifying compliance gaps...")
        gaps = identify_gaps(regulation_analysis, existing_policies)
        print(f"[OK] Gap analysis complete")
        print(f"  - Total Gaps: {gaps.get('total_gaps')}")
        print(f"  - Alignment Score: {gaps.get('alignment_score')}%")
        
        # Save comprehensive report
        report = {
            "timestamp": datetime.now().isoformat(),
            "regulation_analysis": regulation_analysis,
            "gap_analysis": gaps,
            "action_items": regulation_analysis.get('measurable_action_points', [])
        }
        
        report_file = f"reports/compliance_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        with open(report_file, 'w', encoding='utf-8') as f:
            json.dump(report, f, indent=2, ensure_ascii=False)
        print(f"\n[OK] Report saved to {report_file}")
        
        # Print summary
        print("\n" + "=" * 60)
        print("COMPLIANCE ANALYSIS SUMMARY")
        print("=" * 60)
        print(f"\nRegulation Type: {regulation_analysis.get('regulation_type')}")
        print(f"Summary: {regulation_analysis.get('summary')[:150]}...")
        print(f"\nAffected Departments: {', '.join(regulation_analysis.get('affected_departments', []))}")
        print(f"\nAlignment Score: {gaps.get('alignment_score')}%")
        print(f"\nCritical Gaps: {sum(1 for g in gaps.get('gaps', []) if g.get('severity') == 'Critical')}")
        print("\nMeasurable Action Points:")
        for i, action in enumerate(regulation_analysis.get('measurable_action_points', []), 1):
            print(f"  {i}. {action.get('action')} ({action.get('timeline')})")
        
    except Exception as e:
        print(f"\n[ERROR] {str(e)}")
        import traceback
        traceback.print_exc()