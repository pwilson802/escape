Ext.define('escape.utils.AppVars', {
    singleton: true,
    appName: 'DNSW Sydney Guide',
    currentSection: null,
    currentPage: null,
    childbrowser: null,
    thingsToDoSearchType: null,
    // The funnel back destination webpath. Used to match funnelback collections names to the matrix ones
    collectionMapping: [{
        name: 'Accommodation',
        funnelback: 'accom',
        matrix: 'accommodation'
    }, {
        name: 'Attraction',
        funnelback: 'attr',
        matrix: 'attraction'
    }, {
        name: 'Event',
        funnelback: 'event',
        matrix: 'event'
    }, {
        name: 'Hire',
        funnelback: 'hire',
        matrix: 'hire'
    }, {
        name: 'Restaurant',
        funnelback: 'restaurants',
        matrix: 'restaurant'
    }, {
        name: 'Tour',
        funnelback: 'tour',
        matrix: 'tour'
    }, {
        name: 'Visitor Centre',
        funnelback: 'vic',
        matrix: 'vic'
    }]
});