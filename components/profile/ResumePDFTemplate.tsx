import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { PolishedResumeContent } from "@/lib/nvidia";

const styles = StyleSheet.create({
  page: {
    paddingTop: 35,
    paddingBottom: 35,
    paddingLeft: 45,
    paddingRight: 45,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#1e293b", // Slate 800
    lineHeight: 1.4,
  },
  header: {
    marginBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#cbd5e1", // Slate 300
    paddingBottom: 10,
    alignItems: "center",
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0f172a", // Slate 900
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  title: {
    fontSize: 10.5,
    fontWeight: "medium",
    color: "#475569", // Slate 600
    marginTop: 2,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 6,
    gap: 6,
    color: "#64748b", // Slate 500
  },
  contactItem: {
    fontSize: 8.5,
  },
  section: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 10.5,
    fontWeight: "bold",
    color: "#0f172a", // Slate 900
    textTransform: "uppercase",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0", // Slate 200
    paddingBottom: 2,
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  summaryText: {
    fontSize: 9,
    color: "#334155", // Slate 700
    textAlign: "justify",
  },
  experienceItem: {
    marginBottom: 8,
  },
  experienceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  companyName: {
    fontSize: 9.5,
    fontWeight: "bold",
    color: "#0f172a",
  },
  experienceDates: {
    fontSize: 8.5,
    color: "#64748b",
  },
  experienceTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 1,
    marginBottom: 3,
  },
  jobTitle: {
    fontSize: 9,
    fontStyle: "italic",
    color: "#475569",
  },
  bulletList: {
    marginLeft: 6,
  },
  bulletPoint: {
    flexDirection: "row",
    marginBottom: 2,
  },
  bulletSign: {
    width: 8,
    fontSize: 9,
    color: "#64748b",
  },
  bulletText: {
    flex: 1,
    fontSize: 9,
    color: "#334155",
  },
  educationItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  educationText: {
    fontSize: 9,
    color: "#1e293b",
  },
  educationUni: {
    fontWeight: "bold",
    color: "#0f172a",
  },
  educationDetails: {
    color: "#475569",
  },
  educationYear: {
    fontSize: 8.5,
    color: "#64748b",
  },
  skillsText: {
    fontSize: 9,
    color: "#334155",
  },
});

interface ResumePDFTemplateProps {
  profile: {
    full_name: string;
    email: string;
    phone?: string;
    location?: string;
    linkedin_url?: string;
    portfolio_url?: string;
    skills?: string[];
    education?: Array<{
      degree: string;
      field: string;
      institution: string;
      year: string;
    }>;
  };
  polished: PolishedResumeContent;
}

export function ResumePDFTemplate({ profile, polished }: ResumePDFTemplateProps) {
  // Format contact details into an array to render with dividers
  const contactInfo = [
    profile.email,
    profile.phone || null,
    profile.location || null,
    profile.linkedin_url ? "LinkedIn" : null,
    profile.portfolio_url ? "Portfolio" : null,
  ].filter(Boolean);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{profile.full_name}</Text>
          {profile.linkedin_url || profile.portfolio_url || profile.phone || profile.location ? (
            <Text style={styles.title}>
              {polished.work_experience?.[0]?.jobTitle || "Professional"}
            </Text>
          ) : null}
          <View style={styles.contactRow}>
            {contactInfo.map((item, index) => (
              <Text key={index} style={styles.contactItem}>
                {item}
                {index < contactInfo.length - 1 ? "  |  " : ""}
              </Text>
            ))}
          </View>
        </View>

        {/* Professional Summary */}
        {polished.professional_summary ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Summary</Text>
            <Text style={styles.summaryText}>{polished.professional_summary}</Text>
          </View>
        ) : null}

        {/* Experience */}
        {polished.work_experience && polished.work_experience.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Experience</Text>
            {polished.work_experience.map((role, idx) => (
              <View key={idx} style={styles.experienceItem}>
                <View style={styles.experienceHeader}>
                  <Text style={styles.companyName}>{role.company}</Text>
                  <Text style={styles.experienceDates}>
                    {role.startDate} – {role.endDate || (role.current ? "Present" : "")}
                  </Text>
                </View>
                <View style={styles.experienceTitleRow}>
                  <Text style={styles.jobTitle}>{role.jobTitle}</Text>
                </View>
                <View style={styles.bulletList}>
                  {role.bullets?.map((bullet, bIdx) => (
                    <View key={bIdx} style={styles.bulletPoint}>
                      <Text style={styles.bulletSign}>•</Text>
                      <Text style={styles.bulletText}>{bullet}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        ) : null}

        {/* Education */}
        {profile.education && profile.education.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {profile.education.map((edu, idx) => (
              <View key={idx} style={styles.educationItem}>
                <Text style={styles.educationText}>
                  <Text style={styles.educationUni}>{edu.institution}</Text>
                  <Text style={styles.educationDetails}>
                    {"  |  "}{edu.degree} in {edu.field}
                  </Text>
                </Text>
                <Text style={styles.educationYear}>{edu.year}</Text>
              </View>
            ))}
          </View>
        ) : null}

        {/* Skills */}
        {profile.skills && profile.skills.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <Text style={styles.skillsText}>{profile.skills.join(", ")}</Text>
          </View>
        ) : null}
      </Page>
    </Document>
  );
}
