const sampleCourses = [
  // 1. Web Development
  {
    courseName: "Full Stack Modern Web Development with React & Node",
    category: "Web Development",
    description: "Master modern full-stack web engineering from frontend components, state management with React, to RESTful APIs and authentication with Node.js and Express.",
    skills: ["React", "JavaScript", "Node.js", "Express", "REST APIs", "CSS3"],
    difficulty: "Beginner",
    duration: "8 weeks",
    courseLink: "https://www.coursera.org/specializations/full-stack-react"
  },
  {
    courseName: "Advanced Next.js 14, TypeScript & Server Actions",
    category: "Web Development",
    description: "Level up your web development with SSR, App Router, TypeScript type safety, caching strategies, and high-performance serverless deployments.",
    skills: ["Next.js", "TypeScript", "React", "Server Actions", "Tailwind CSS"],
    difficulty: "Advanced",
    duration: "6 weeks",
    courseLink: "https://nextjs.org/learn"
  },
  {
    courseName: "Responsive Web Design with Tailwind CSS & UI Principles",
    category: "Web Development",
    description: "Learn fluid layouts, mobile-first design, CSS Grid, Flexbox, accessible micro-interactions, and design systems using Tailwind CSS.",
    skills: ["HTML5", "CSS3", "Tailwind CSS", "UI/UX", "Responsive Design"],
    difficulty: "Beginner",
    duration: "4 weeks",
    courseLink: "https://tailwindcss.com"
  },

  // 2. Programming
  {
    courseName: "Data Structures & Algorithms in Java",
    category: "Programming",
    description: "Comprehensive guide to core data structures (arrays, linked lists, trees, graphs) and algorithmic paradigms for technical interview preparation.",
    skills: ["Java", "Data Structures", "Algorithms", "Problem Solving"],
    difficulty: "Intermediate",
    duration: "10 weeks",
    courseLink: "https://www.coursera.org/specializations/data-structures-algorithms"
  },
  {
    courseName: "Python Mastery: From Fundamentals to Object-Oriented Design",
    category: "Programming",
    description: "Build clean, idiomatic Python code. Learn OOP, functional idioms, generators, decorators, testing, and modern packaging.",
    skills: ["Python", "OOP", "Debugging", "Software Design"],
    difficulty: "Beginner",
    duration: "6 weeks",
    courseLink: "https://docs.python.org/3/tutorial/"
  },
  {
    courseName: "Concurrent & Systems Programming with Go",
    category: "Programming",
    description: "Explore goroutines, channels, race detectors, memory profiling, and building concurrent network services in Golang.",
    skills: ["Go", "Concurrency", "Multithreading", "Systems Design"],
    difficulty: "Advanced",
    duration: "8 weeks",
    courseLink: "https://go.dev/tour/"
  },

  // 3. Data
  {
    courseName: "Data Analysis and Visualization with Python & Pandas",
    category: "Data",
    description: "Learn to clean, aggregate, wrangle real-world datasets and create executive visual dashboards using Pandas, NumPy, Matplotlib, and Seaborn.",
    skills: ["Python", "Pandas", "NumPy", "Data Visualization", "Data Cleaning"],
    difficulty: "Beginner",
    duration: "6 weeks",
    courseLink: "https://pandas.pydata.org"
  },
  {
    courseName: "Applied Data Science & Machine Learning Pipeline",
    category: "Data",
    description: "Train supervised and unsupervised models using Scikit-Learn. Feature engineering, cross-validation, hyperparameter tuning, and evaluation metrics.",
    skills: ["Scikit-Learn", "Machine Learning", "Python", "Data Science", "Statistics"],
    difficulty: "Intermediate",
    duration: "8 weeks",
    courseLink: "https://scikit-learn.org"
  },
  {
    courseName: "Big Data Processing with Apache Spark and Kafka",
    category: "Data",
    description: "Architect scalable distributed pipelines for batch and streaming data using Apache Spark, Kafka streams, and Delta Lake.",
    skills: ["Apache Spark", "Kafka", "Big Data", "Distributed Computing", "Scala"],
    difficulty: "Advanced",
    duration: "10 weeks",
    courseLink: "https://spark.apache.org"
  },

  // 4. AI
  {
    courseName: "Deep Learning & Neural Networks with PyTorch",
    category: "AI",
    description: "Construct convolutional networks (CNNs), recurrent models (RNNs/LSTMs), and attention mechanisms from scratch using PyTorch.",
    skills: ["Deep Learning", "PyTorch", "Computer Vision", "Neural Networks"],
    difficulty: "Intermediate",
    duration: "8 weeks",
    courseLink: "https://pytorch.org/tutorials"
  },
  {
    courseName: "Generative AI, Large Language Models & Prompt Engineering",
    category: "AI",
    description: "Build GenAI applications leveraging the Gemini API, LangChain, embeddings, retrieval-augmented generation (RAG), and agentic workflows.",
    skills: ["Generative AI", "LLMs", "Prompt Engineering", "Gemini API", "RAG"],
    difficulty: "Intermediate",
    duration: "6 weeks",
    courseLink: "https://ai.google.dev"
  },
  {
    courseName: "Foundations of Artificial Intelligence & Search Algorithms",
    category: "AI",
    description: "Theoretical and practical foundations of heuristic search (A*), constraint satisfaction, game-playing minimax, and probabilistic models.",
    skills: ["Artificial Intelligence", "Search Algorithms", "Logic", "Python"],
    difficulty: "Beginner",
    duration: "6 weeks",
    courseLink: "https://www.edx.org/course/artificial-intelligence"
  },

  // 5. Cloud
  {
    courseName: "Cloud Computing Fundamentals with AWS",
    category: "Cloud",
    description: "Get started with core cloud primitives: EC2, S3, IAM, VPC, and serverless Lambda functions for modern application hosting.",
    skills: ["AWS", "Cloud Computing", "S3", "EC2", "IAM"],
    difficulty: "Beginner",
    duration: "5 weeks",
    courseLink: "https://aws.amazon.com/training/"
  },
  {
    courseName: "Docker, Containers & Kubernetes Orchestration",
    category: "Cloud",
    description: "Containerize multi-tier web applications, manage container registries, write Helm charts, and orchestrate production clusters with Kubernetes.",
    skills: ["Docker", "Kubernetes", "DevOps", "CI/CD", "Linux"],
    difficulty: "Intermediate",
    duration: "8 weeks",
    courseLink: "https://kubernetes.io/docs/tutorials/"
  },
  {
    courseName: "Enterprise Cloud Architecture & Terraform Infrastructure as Code",
    category: "Cloud",
    description: "Design high-availability, multi-region cloud architectures automated through Terraform, monitoring, and automated disaster recovery.",
    skills: ["Terraform", "Cloud Architecture", "AWS", "Infrastructure as Code"],
    difficulty: "Advanced",
    duration: "8 weeks",
    courseLink: "https://www.terraform.io"
  },

  // 6. Security
  {
    courseName: "Cybersecurity Fundamentals & Network Defense",
    category: "Security",
    description: "Understand network protocols, packet inspection, firewalls, cryptographic fundamentals, and common attack vectors.",
    skills: ["Cybersecurity", "Network Security", "Cryptography", "Risk Assessment"],
    difficulty: "Beginner",
    duration: "6 weeks",
    courseLink: "https://www.cybrary.it"
  },
  {
    courseName: "Web Application Security & OWASP Top 10 Penetration Testing",
    category: "Security",
    description: "Ethical hacking, SQL injection, XSS, CSRF, security headers, authentication exploits, and hardening modern web stacks.",
    skills: ["Web Security", "OWASP", "Penetration Testing", "Security Auditing"],
    difficulty: "Intermediate",
    duration: "7 weeks",
    courseLink: "https://owasp.org/www-project-top-ten/"
  },

  // 7. Database
  {
    courseName: "Relational Database Design & SQL Optimization",
    category: "Database",
    description: "Master normalized relational schemas (1NF-3NF), complex joins, subqueries, indexing strategies, transactions (ACID), and query profiling in PostgreSQL.",
    skills: ["SQL", "PostgreSQL", "Database Design", "Performance Optimization"],
    difficulty: "Beginner",
    duration: "6 weeks",
    courseLink: "https://www.postgresqltutorial.com"
  },
  {
    courseName: "NoSQL Engineering with MongoDB & Distributed Caching with Redis",
    category: "Database",
    description: "Schema design patterns for document databases, aggregation pipelines, replica sets, sharding, and ultra-fast caching using Redis.",
    skills: ["MongoDB", "Mongoose", "NoSQL", "Redis", "Data Modeling"],
    difficulty: "Intermediate",
    duration: "6 weeks",
    courseLink: "https://www.mongodb.com/developer"
  }
];

module.exports = { sampleCourses };
