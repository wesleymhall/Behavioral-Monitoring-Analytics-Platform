const infoContent = {
    'stats' : {
        name: 'stats',
        text: `
            middle: the median value of the metric, representing a typical value.
            spread: average absolute deviation from the mean; shows variability in the metric.
            common: the most frequently occurring value (mode) in the period.
            mix: entropy of the values; higher values indicate more diversity or randomness.
            trend: linear trend (slope) over time; positive means increasing, negative decreasing.
            `,
    },
    'connects' : {
        name: 'connects',
        text: 'explanation of connects and how to use it',
    },
}

export { infoContent };