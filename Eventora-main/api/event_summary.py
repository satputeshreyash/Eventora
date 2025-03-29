import json
import os
from fpdf import FPDF
from datetime import datetime

class PDF(FPDF):
    def header(self):
        self.set_font('Arial', 'B', 12)
        self.cell(0, 10, 'Event Summary', 0, 1, 'C')

    def add_section(self, title, content):
        self.set_font('Arial', 'B', 12)
        self.cell(0, 10, title, 0, 1)
        self.set_font('Arial', '', 12)
        self.multi_cell(0, 10, content)

def generate_summary(event_data):
    pdf = PDF()
    pdf.add_page()

    pdf.add_section("Title", event_data['title'])

    content = event_data.get('content', 'No content available')
    pdf.add_section("Content", content)

    created_at = datetime.fromisoformat(event_data['createdAt'].replace('Z', '+00:00'))
    pdf.add_section("Creation Date", created_at.strftime("%Y-%m-%d %H:%M:%S"))

    for sub_event in event_data['participantsData']:
        pdf.add_section(f"Sub Event: {sub_event['eventName']}", f"Price: ${sub_event['eventPrice']}")

        participants_list = [f"{participant['username']} (ID: {participant['userId']})" for participant in sub_event.get('participants', [])]
        participants_str = ', '.join(participants_list) if participants_list else 'No participants'

        pdf.add_section("Participants", participants_str)

    pdf_file = os.path.join(os.path.dirname(__file__), "event_summary.pdf")
    pdf.output(pdf_file)
    return pdf_file

if __name__ == "__main__":
    event_data = json.loads(input())
    
    pdf_file = generate_summary(event_data)
    print(f"PDF generated: {pdf_file}")
