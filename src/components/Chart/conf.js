import portfolioPriceData from './data'


export const conf={ 
        chart: {
            marginTop: 0,
            backgroundColor: '#000',
        },
        rangeSelector: {
            selected: 0,
            allButtonsEnabled: true,
            inputEnabled: false,
            verticalAlign: 'bottom',
            buttonPosition: {
                align: 'center',
            },
            buttonTheme: {
                fill: '',
                style: {
                    color: '#6b2fe2',
                    textTransform: 'uppercase',
                    backgroundColor: 'transparent'
                },
                states: {
                    select: {
                        fill: '#6b2fe2',
                        style: {
                            color: 'white'
                        }
                    }
                }
            },
            buttons: [{
                    type: 'hour',
                    count: 1,
                    text: '1h'
                },
                {
                    type: 'hour',
                    count: 2,
                    text: '2h'
                },
                {
                    type: 'day',
                    count: 1,
                    text: '1d'
                },
                {
                    type: 'week',
                    count: 1,
                    text: '1w'
                },
                {
                    type: 'month',
                    count: 1,
                    text: '1m'
                },
                {
                    type: 'year',
                    count: 1,
                    text: '1y'
                },
                {
                    type: 'all',
                    text: 'All'
                },
            ]
        },
        navigator: {
            enabled: false
        },
        scrollbar: {
            enabled: false
        },
        xAxis: {
            visible: false,
            minRange: 3600 * 1000,
        },
        yAxis: {
            gridLineWidth: 0,
            visible: false,
        },
        series: [{
            name: 'ETH Stock Price',
            data: portfolioPriceData,
            type: 'spline',
            tooltip: {
                valueDecimals: 2
            }
        }],
        plotOptions: {
            series: {
                color: '#6b2fe2'
            }
        },
        exporting: {
            enabled: false
        },
        credits: {
            enabled: false
        }
}


export const options = {
            lang:{
                rangeSelectorZoom: ''
            }
}