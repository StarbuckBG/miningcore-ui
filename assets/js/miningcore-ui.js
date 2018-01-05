// config
var API = 'https://localhost:4000/api/';
var defaultPool = ''; //ID

// current indicator + cache
var currentPool = defaultPool;

// private function
function _formatter(value, decimal, unit) {
    if (value === 0) {
        return '0 ' + unit;
    } else {
        var si = [
            { value: 1e-6, symbol: "μ" },
            { value: 1e-3, symbol: "m" },
            { value: 1, symbol: "" },
            { value: 1e3, symbol: "k" },
            { value: 1e6, symbol: "M" },
            { value: 1e9, symbol: "G" },
            { value: 1e12, symbol: "T" },
            { value: 1e15, symbol: "P" },
            { value: 1e18, symbol: "E" },
        ];
        for (var i = si.length - 1; i > 0; i--) {
            if (value >= si[i].value) {
                break;
            }
        }
        return (value / si[i].value).toFixed(decimal).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, "$1") + ' ' + si[i].symbol + unit;
    }
}

function loadPools(renderCallback) {
    $('#currentPool b').remove();
    $('#currentPool ul').remove();
    return $.ajax(API + 'pools')
        .done(function (data) {
            var poolList = '<ul class="dropdown-menu">';
            if (data.pools.length > 1) {
                $('#currentPool').append('<b class="caret"></b>');
            }
            $.each(data.pools, function (index, value) {
                if (currentPool.length === 0 && index === 0) {
                    currentPool = value.id;
                }
                if (currentPool === value.id) {
                    $('#currentPool p').attr('data-id', value.id);
                    $('#currentPool p').text(value.coin.type);
                } else {
                    poolList += '<li><a href="javascript:void(0)" data-id="' + value.id + '">' + value.coin.type + '</a></li>';
                }
            });
            poolList += '</ul>';
            if (poolList.length > 0) {
                $('#poolList').append(poolList);
            }
            $('#poolList li a').on('click', function (event) {
                currentPool = $(event.target).attr('data-id');
                loadPools(renderCallback);
            });
            if (renderCallback.has()) {
                renderCallback.fire();
            }
        })
        .fail(function () {
            $.notify({
                icon: "ti-cloud-down",
                message: "Error: No response from API.<br>(loadPools)",
            }, {
                type: 'danger',
                timer: 3000,
            });
        });
}

function loadStatsData() {
    return $.ajax(API + 'pools')
        .done(function (data) {
            $.each(data.pools, function (index, value) {
                if (currentPool === value.id) {
                    //$('#poolShares').text(_formatter(value, 0, ''));
                    //$('#poolBlocks').text(_formatter(value, 0, ''));
                    $('#poolMiners').text(_formatter(value.poolStats.connectedMiners, 0, ''));
                    $('#poolHashRate').text(_formatter(value.poolStats.poolHashRate, 5, 'H/s'));
                    $('#networkHashRate').text(_formatter(value.networkStats.networkHashRate, 5, 'H/s'));
                    $('#networkDifficulty').text(_formatter(value.networkStats.networkDifficulty, 5, ''));
                }
            });
        })
        .fail(function () {
            $.notify({
                icon: "ti-cloud-down",
                message: "Error: No response from API.<br>(loadStatsData)",
            }, {
                type: 'danger',
                timer: 3000,
            });
        });
}

function loadStatsChart() {
    return $.ajax(API + 'pools/' + currentPool + '/stats/hourly')
        .done(function (data) {
            labels = [];
            connectedMiners = [];
            networkHashRate = [];
            poolHashRate = [];
            lowHashRate = 1e18;
            maxHashRate = 0;
            //lowMiners = 1e18;
            //maxMiners = 0;

            $.each(data.stats, function (index, value) {
                if (labels.length === 0 || (labels.length + 1) % 4 === 1) {
                    labels.push(new Date(value.created).toLocaleTimeString());
                } else {
                    labels.push('');
                }
                /*
                networkHashRate.push(value.networkHashRate);
                if (value.networkHashRate < lowHashRate) {
                    lowHashRate = value.poolHashRate;
                } else if (value.networkHashRate > maxHashRate) {
                    maxHashRate = value.poolHashRate;
                }
                */
                poolHashRate.push(value.poolHashRate);
                if (value.poolHashRate < lowHashRate) {
                    lowHashRate = value.poolHashRate;
                } else if (value.poolHashRate > maxHashRate) {
                    maxHashRate = value.poolHashRate;
                }
                connectedMiners.push(value.connectedMiners);
                /*
                if (value.connectedMiners < lowMiners) {
                    lowMiners = value.connectedMiners;
                } else if (value.connectedMiners < maxMiners){
                    maxMiners = value.connectedMiners;
                }
                */
            });

            var data = {
                labels: labels,
                series: [
                    networkHashRate,
                    poolHashRate,
                ],
            };

            var options = {
                low: lowHashRate,
                high: maxHashRate,
                showArea: true,
                height: "245px",
                axisX: {
                    showGrid: false,
                },
                axisY: {
                    labelInterpolationFnc: function(value) {
                        return _formatter(value, 1, '');
                    }
                },
                lineSmooth: Chartist.Interpolation.simple({
                    divisor: 2,
                }),
                showLine: true,
                showPoint: false,
            };

            var responsiveOptions = [
                ['screen and (max-width: 640px)', {
                    axisX: {
                        labelInterpolationFnc: function (value) {
                            return value[0];
                        }
                    },
                }],
            ];

            Chartist.Line('#chartStatsHashRate', data, options, responsiveOptions);

            var data = {
                labels: labels,
                series: [
                    connectedMiners,
                ],
            };

            var options = {
                //low: lowMiners,
                //high: maxMiners,
                seriesBarDistance: 10,
                axisX: {
                    showGrid: false,
                },
                height: "245px",
            };

            var responsiveOptions = [
                ['screen and (max-width: 640px)', {
                    seriesBarDistance: 5,
                    axisX: {
                        labelInterpolationFnc: function (value) {
                            return value[0];
                        }
                    },
                }],
            ];

            Chartist.Line('#chartStatsMiners', data, options, responsiveOptions);
        })
        .fail(function () {
            $.notify({
                icon: "ti-cloud-down",
                message: "Error: No response from API.<br>(loadStatsChart)",
            }, {
                type: 'danger',
                timer: 3000,
            });
        });
}

function loadDashboardData(walletAddress) {
    return $.ajax(API + 'pools/' + currentPool + '/miner/' + walletAddress + '/stats')
        .done(function (data) {
            $('#pendingShares').text(_formatter(data.result.pendingShares), 0, 'S');
            var workerHashRate = 0;
            $.each(data.result.performance.workers, function (index, value) {
                workerHashRate += value.hashrate;
            });
            $('#minerHashRate').text(_formatter(workerHashRate, 5, 'H/s'));
            $('#pendingBalance').text(_formatter(data.result.pendingBalance), 5, '');
            $('#paidBalance').text(_formatter(data.result.totalPaid), 5, '');
            $('#lifetimeBalance').text(_formatter(data.result.pendingBalance + data.result.totalPaid), 5, '');
        })
        .fail(function () {
            $.notify({
                icon: "ti-cloud-down",
                message: "Error: No response from API.<br>(loadDashboardData)",
            }, {
                type: 'danger',
                timer: 3000,
            });
        });
}

function loadDashboardWorkerList(walletAddress) {
    return $.ajax(API + 'pools/' + currentPool + '/miner/' + walletAddress + '/stats')
        .done(function (data) {
            var workerList = '<thead><th>Name</th><th>Hash Rate</th><th>Share Rate</th></thead><tbody>';
            if (data.performance.workers != null) {
                $.each(data.performance.workers, function (index, value) {
                    workerList += '<tr>';
                    workerList += '<td>' + index + '</td>';
                    workerList += '<td>' + _formatter(value.hashrate, 5, 'H/s') + '</td>';
                    workerList += '<td>' + _formatter(value.sharesPerSecond, 5, 'S/s') + '</td>';
                    workerList += '</tr>'
                });
            } else {
                workerList += '<tr><td colspan="3">None</td></tr>';
            }
            workerList += '</tbody>';
            $('#workerList').html(workerList);
        })
        .fail(function () {
            $.notify({
                icon: "ti-cloud-down",
                message: "Error: No response from API.<br>(loadDashboardWorkerList)",
            }, {
                type: 'danger',
                timer: 3000,
            });
        });
}

function loadDashboardChart(walletAddress) {
    return $.ajax(API + 'pools/' + currentPool + '/miner/' + walletAddress + '/stats')
        .done(function (data) {
            labels = [];
            minerHashRate = [];
            lowHashRate = 1e18;
            maxHashRate = 0;
            $.each(data.result.performance, function (index, value) {
                if (labels.length === 0 || (labels.length + 1) % 4 === 1) {
                    labels.push(new Date(value.created).toLocaleTimeString());
                } else {
                    labels.push('');
                }
                var workerHashRate = 0;
                $.each(value.workers, function (index2, value2) {
                    workerHashRate += value2.hashrate;
                });
                minerHashRate.push(workerHashRate);
                if (workerHashRate < lowHashRate) {
                    lowHashRate = value.minerHashRate;
                } else if (workerHashRate > maxHashRate) {
                    maxHashRate = value.minerHashRate;
                }
            });

            var data = {
                labels: labels,
                series: [
                    poolHashRate,
                    minerHashRate,
                ],
            };

            var options = {
                low: lowHashRate,
                high: maxHashRate,
                showArea: true,
                height: "245px",
                axisX: {
                    showGrid: false,
                },
                axisY: {
                    labelInterpolationFnc: function(value) {
                        return _formatter(value, 1, '');
                    }
                },
                lineSmooth: Chartist.Interpolation.simple({
                    divisor: 2,
                }),
                showLine: true,
                showPoint: false,
            };

            var responsiveOptions = [
                ['screen and (max-width: 640px)', {
                    axisX: {
                        labelInterpolationFnc: function (value) {
                            return value[0];
                        }
                    },
                }],
            ];

            Chartist.Line('#chartDashboardHashRate', data, options, responsiveOptions);
        })
        .fail(function () {
            $.notify({
                icon: "ti-cloud-down",
                message: "Error: No response from API.<br>(loadDashboardChart)",
            }, {
                type: 'danger',
                timer: 3000,
            });
        });
}

function loadBlocksList() {
    return $.ajax(API + 'pools/' + currentPool + '/blocks')
        .done(function (data) {
            var blockList = '<thead><th>Date &amp; Time</th><th>Height</th><th>Effort</th></th><th>Status</th><th colspan="2">Confirmation</th></thead><tbody>';
            if (data.length > 0) {
                $.each(data, function (index, value) {
                    blockList += '<tr>';
                    blockList += '<td>' + new Date(value.created).toLocaleString() + '</td>';
                    blockList += '<td>' + value.blockHeight + '</td>';
                    blockList += '<td>~' + Math.round(value.effort * 100) + '%</td>';
                    blockList += '<td>' + value.status + '</td>';
                    blockList += '<td>~' + Math.round(value.confirmationProgress * 100) + '%</td>';
                    blockList += '<td><a href="' + value.infoLink + '" target="_blank">' + value.transactionConfirmationData.substring(0, 10) + ' &hellip; ' + value.transactionConfirmationData.substring(value.transactionConfirmationData.length - 8) + ' </a></td>';
                    blockList += '</tr>'
                });
            } else {
                blockList += '<tr><td colspan="4">None</td></tr>';
            }
            blockList += '</tbody>';
            $('#blockList').html(blockList);
        })
        .fail(function () {
            $.notify({
                icon: "ti-cloud-down",
                message: "Error: No response from API.<br>(loadBlocksList)",
            }, {
                type: 'danger',
                timer: 3000,
            });
        });
}

function loadPaymentsList() {
    return $.ajax(API + 'pools/' + currentPool + '/payments')
        .done(function (data) {
            var paymentList = '<thead><th>Date &amp; Time</th><th>Address</th><th>Amount</th><th>Confirmation</th></thead><tbody>';
            if (data.length > 0) {
                $.each(data, function (index, value) {
                    paymentList += '<tr>';
                    paymentList += '<td>' + new Date(value.created).toLocaleString() + '</td>';
                    paymentList += '<td><a href="' + value.addressInfoLink + '" target="_blank">' + value.address.substring(0, 8) + ' &hellip; ' + value.address.substring(value.address.length - 6) + '</td>';
                    paymentList += '<td>' + value.amount + '</td>';
                    paymentList += '<td><a href="' + value.transactionInfoLink + '" target="_blank">' + value.transactionConfirmationData.substring(0, 10) + ' &hellip; ' + value.transactionConfirmationData.substring(value.transactionConfirmationData.length - 8) + ' </a></td>';
                    paymentList += '</tr>';
                });
            } else {
                paymentList += '<tr><td colspan="4">None</td></tr>';
            }
            paymentList += '</tbody>';
            $('#paymentList').html(paymentList);
        })
        .fail(function () {
            $.notify({
                icon: "ti-cloud-down",
                message: "Error: No response from API.<br>(loadPaymentsList)",
            }, {
                type: 'danger',
                timer: 3000,
            });
        });
}

function loadConnectConfig() {
    return $.ajax(API + 'pools')
        .done(function (data) {
            var connectPoolConfig = '<thead><tr><th>Item</th><th>Value</th></tr></thead><tbody>';
            $.each(data.pools, function (index, value) {
                if (currentPool === value.id) {
                    connectPoolConfig += '<tr><td>Wallet Address</td><td><a href="' + value.addressInfoLink + '" target="_blank">' + value.address.substring(0, 8) + ' &hellip; ' + value.address.substring(value.address.length - 6) + '</a></td></tr>';
                    connectPoolConfig += '<tr><td>Payout Scheme</td><td>' + value.paymentProcessing.payoutScheme + '</td></tr>';
                    connectPoolConfig += '<tr><td>Minimum Payment w/o #</td><td>' + value.paymentProcessing.minimumPayment + ' ' + value.coin.type + '</td></tr>';
                    if (typeof(value.paymentProcessing.minimumPaymentToPaymentId) !== "undefined") {
                        connectPoolConfig += '<tr><td>Minimum Payment w/ #</td><td>' + value.paymentProcessing.minimumPaymentToPaymentId + ' ' + value.coin.type + '</td></tr>';
                    }
                    connectPoolConfig += '<tr><td>Pool Fee</td><td>' + value.poolFeePercent + '%</td></tr>';
                    $.each(value.ports, function (port, options) {
                        connectPoolConfig += '<tr><td>Port ' + port + ' Difficulty</td><td>'
                        if (typeof(options.varDiff) !== "undefined") {
                            connectPoolConfig += 'Variable / ' + options.varDiff.minDiff + ' &harr; ';
                            if (typeof(options.varDiff.maxDiff) === "undefined") {
                                connectPoolConfig += '&infin;';
                            } else {
                                connectPoolConfig += options.varDiff.maxDiff;
                            }
                        } else {
                            connectPoolConfig += 'Static / ' + options.difficulty;
                        }
                        connectPoolConfig += '</td></tr>';
                    });
                }
            });
            connectPoolConfig += '</tbody>';
            $('#connectPoolConfig').html(connectPoolConfig);
        })
        .fail(function () {
            $.notify({
                icon: "ti-cloud-down",
                message: "Error: No response from API.<br>(loadConnectConfig)",
            }, {
                type: 'danger',
                timer: 3000,
            });
        });
}
