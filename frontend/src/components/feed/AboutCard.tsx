import PushPinOutlinedIcon from "@mui/icons-material/PushPinOutlined";
import Avatar from "../Avatar";

const skillGroups = [
  { label: "Languages", skills: ["TypeScript", "JavaScript"] },
  {
    label: "Back-end",
    skills: ["Node.js", "NestJS", "PostgreSQL", "Redis", "REST APIs"],
  },
  { label: "Front-end", skills: ["React", "Next.js", "Tailwind CSS", "TanStack"] },
  { label: "Tools", skills: ["Git", "Docker", "AWS", "CI/CD", "Jest", "Cypress"] },
];

const AboutCard = () => {
  return (
    <article id="about-card" className="card">
      <header className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Avatar src="/avatars/adminavatar.jpg" name="Alan Sobchacki" size={48} />
          <div>
            <p className="font-semibold">Alan Sobchacki</p>
            <p className="dark:font-mono text-xs text-muted">Full-stack software engineer</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700 dark:bg-emerald-400/10 dark:text-emerald-400">
          <PushPinOutlinedIcon sx={{ fontSize: 14 }} />
          Pinned
        </span>
      </header>

      <div className="mt-4 space-y-3 leading-relaxed text-gray-700 dark:text-slate-300">
        <p>
          Full-stack software engineer based in Brazil with 4+ years of
          experience. I work mostly with TypeScript, React, Node.js, and
          PostgreSQL, with a slight preference for front-end work.
        </p>
        <p>
          When I&apos;m not at work, you&apos;ll probably find me playing board
          games, grilling, swimming, or just chilling. Maybe even designing some
          t-shirts and stickers.
        </p>
      </div>

      <dl className="mt-5 space-y-3 border-t border-gray-300 pt-5 dark:border-slate-800">
        {skillGroups.map((group) => (
          <div key={group.label} className="flex flex-col gap-2 sm:flex-row sm:items-baseline">
            <dt className="section-label sm:w-24 sm:shrink-0">{group.label}</dt>
            <dd className="flex flex-wrap gap-1.5">
              {group.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-md border border-gray-300 bg-white px-2 py-0.5 dark:font-mono text-xs text-gray-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  {skill}
                </span>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </article>
  );
};

export default AboutCard;
