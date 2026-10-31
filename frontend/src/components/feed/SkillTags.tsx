const skillGroups = [
  { label: "Languages", skills: ["TypeScript", "JavaScript", "Ruby"] },
  {
    label: "Back-end",
    skills: ["Node.js", "NestJS", "PostgreSQL", "Redis", "REST APIs"],
  },
  { label: "Front-end", skills: ["React", "Next.js", "Tailwind CSS", "TanStack"] },
  { label: "Tools", skills: ["Git", "Docker", "AWS", "CI/CD", "Jest", "Cypress"] },
];

const SkillTags = () => {
  return (
    <dl className="mt-5 space-y-3 border-t border-gray-300 pt-5 dark:border-slate-800">
      {skillGroups.map((group) => (
        <div key={group.label} className="flex flex-col gap-2 sm:flex-row sm:items-baseline">
          <dt className="section-label sm:w-24 sm:shrink-0">{group.label}</dt>
          <dd className="flex flex-wrap gap-1.5">
            {group.skills.map((skill) => (
              <span key={skill} className="tag">
                {skill}
              </span>
            ))}
          </dd>
        </div>
      ))}
    </dl>
  );
};

export default SkillTags;
