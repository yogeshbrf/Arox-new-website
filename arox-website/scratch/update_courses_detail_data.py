with open(r'd:\Downloads\Arox new website\arox-website\js\courses-detail-data.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace getCourseBySlug with enhanced version
old_func = """function getCourseBySlug(slug) {
    if (!slug) return coursesData[0];
    const cleanSlug = String(slug).toLowerCase().trim();
    
    // Check direct slug/id match
    let match = coursesData.find(c => c.slug.toLowerCase() === cleanSlug || (c.id && c.id.toLowerCase() === cleanSlug));
    if (match) return match;

    // Check aliases
    const aliasedSlug = courseSlugAliases[cleanSlug];
    if (aliasedSlug) {
        match = coursesData.find(c => c.slug.toLowerCase() === aliasedSlug || (c.id && c.id.toLowerCase() === aliasedSlug));
        if (match) return match;
    }

    // Fallback: match partial
    match = coursesData.find(c => cleanSlug.includes(c.slug.toLowerCase()) || c.slug.toLowerCase().includes(cleanSlug));
    return match || coursesData[0];
}"""

new_aliases = """courseSlugAliases = {
    'full-stack-web-engineering': 'full-stack-web-development',
    'python-backend-microservices': 'python-dev',
    'python-full-stack': 'python-dev',
    'java-full-stack': 'java-fsd',
    'aws-cloud-computing': 'cloud-aws',
    'devops': 'devops-engineering',
    'data-analytics-data-science': 'data-science-and-ai',
    'generative-ai': 'ai-agent-internship',
    'ai-ml': 'data-science-and-ai',
    'selenium-testing': 'software-development',
    'data-science-ai-systems': 'data-science-and-ai',
    'data-science-ai': 'data-science-and-ai',
    'cyber-security-pentesting': 'cyber-security',
    'cloud-devops-engineering': 'devops-engineering',
    'cross-platform-mobile-dev': 'app-development',
    'ui-ux-product-design': 'ui-ux-designing',
    'ui-ux-design': 'ui-ux-designing',
    'embedded-systems-iot': 'embedded-systems-and-iot',
    'embedded-system': 'embedded-systems-and-iot',
    'iot': 'embedded-systems-and-iot',
    'iot-robotics': 'embedded-systems-and-iot',
    'mern-stack-cloud-engineering': 'mern-stack'
};"""

new_func = """function getCourseBySlug(slug) {
    if (!slug) return coursesData[0];
    const cleanSlug = String(slug).toLowerCase().trim();
    
    // Check direct slug/id match
    let match = coursesData.find(c => c.slug.toLowerCase() === cleanSlug || (c.id && c.id.toLowerCase() === cleanSlug));
    if (match) return match;

    // Check aliases
    const aliasedSlug = courseSlugAliases[cleanSlug];
    if (aliasedSlug) {
        match = coursesData.find(c => c.slug.toLowerCase() === aliasedSlug || (c.id && c.id.toLowerCase() === aliasedSlug));
        if (match) return match;
    }

    // Fallback: match partial
    match = coursesData.find(c => cleanSlug.includes(c.slug.toLowerCase()) || c.slug.toLowerCase().includes(cleanSlug));
    if (match) return match;

    // Dynamic Generator for all course IDs (e.g. power-bi, salesforce, vlsi-design, etc.)
    const titleWords = cleanSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    return {
        slug: cleanSlug,
        id: cleanSlug,
        title: titleWords,
        category: 'Professional Track',
        badge: 'CERTIFIED PROGRAM',
        heroAccent: `${titleWords} Specialist`,
        desc: `Master ${titleWords} with production-level case studies, industry workflows, and verified certification.`,
        heroFeatures: [
            'Live Production Case Studies',
            'Practical Hands-on Projects',
            'Industry Expert Mentorship',
            'Syllabus & Portfolio Reviews',
            'Verified Experience Certificate',
            'Placement & Career Guidance'
        ],
        techStack: [titleWords, 'Professional Tools', 'Git', 'Cloud Platforms'],
        topics: [
            {
                title: `${titleWords} Core Fundamentals`,
                tool: 'Core Essentials',
                desc: `Understand core concepts, architecture, and toolsets essential for modern ${titleWords}.`
            },
            {
                title: 'Practical Workflows & Advanced Techniques',
                tool: 'Advanced Tools',
                desc: 'Implement advanced features, optimization practices, and real-time workflows.'
            },
            {
                title: 'Industry Case Studies & Real Scenarios',
                tool: 'Case Studies',
                desc: 'Analyze live industrial scenarios and apply best engineering and design practices.'
            },
            {
                title: 'Capstone Project & Certification',
                tool: 'Capstone',
                desc: 'Build a production-grade portfolio project and complete certification review.'
            }
        ]
    };
}"""

idx_alias = text.find('courseSlugAliases = {')
idx_alias_end = text.find('};', idx_alias)
text = text[:idx_alias] + new_aliases + text[idx_alias_end+2:]

text = text.replace(old_func, new_func)

with open(r'd:\Downloads\Arox new website\arox-website\js\courses-detail-data.js', 'w', encoding='utf-8') as f:
    f.write(text)

print("courses-detail-data.js updated with dynamic resolver!")

