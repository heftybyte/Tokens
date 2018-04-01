import { baseColor } from '../../config'

export function ChartConfig (data, color){

        this.conf={ 
                chart: {
                    marginTop: 0,
                    backgroundColor: baseColor,
                },
                tooltip: {
                    enabled: false
                },
                rangeSelector: {
                    enabled: false
                },
                navigator: {
                    enabled: false
                },
                scrollbar: {
                    enabled: false
                },
                xAxis: {
                    type: 'datetime',
                    visible: false,
                    minRange: 3600 * 1000,
                    labels: false
                },
                yAxis: {
                    gridLineWidth: 0,
                    visible: false,
                    labels: false
                },
                series: [{
                    data: data,
                    type: 'spline',
                    tooltip: {
                        enabled: false
                    }
                }],
                plotOptions: {
                    series: {
                        color: color
                    }
                },
                exporting: {
                    enabled: false
                },
                credits: {
                    enabled: false
                }
        }

       this.options = {
            lang:{
                rangeSelectorZoom: ''
            }
        }
}