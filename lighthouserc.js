/** @type {import('@lhci/cli').LHConfig} */
module.exports = {
  ci: {
    collect: {
      startServerCommand: "npx serve dist -l 3000",
      url: ["http://localhost:3000"],
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        "categories:accessibility": ["error", { minScore: 0.9 }],
      },
    },
    upload: {
      target: "temporary-public-storage",
    },
  },
};
