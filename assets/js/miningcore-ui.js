// config
var API = 'https://localhost:4000/api/';
var defaultPool = ''; //ID

// current indicator + cache
var currentPool = defaultPool;

function loadPools(renderCallback) {
    $('#currentPool b').remove();
    $('#currentPool ul').remove();
    return $.ajax(API + 'pools')
        .always(function (data) {//debug,should be done()
//            data = JSON.parse('{"pools":[{"id":"xmr1","coin":{"type":"XMR"},"ports":{"4032":{"difficulty":1600,"varDiff":{"minDiff":1600,"maxDiff":160000,"targetTime":15,"retargetTime":90,"variancePercent":30}},"4256":{"difficulty":5000}},"paymentProcessing":{"enabled":true,"minimumPayment":0.01,"payoutScheme":"PPLNS","payoutSchemeConfig":{"factor":2},"minimumPaymentToPaymentId":5},"banning":{"enabled":true,"checkThreshold":50,"invalidPercent":50,"time":600},"clientConnectionTimeout":600,"jobRebroadcastTimeout":55,"blockRefreshInterval":1000,"poolFeePercent":0,"address":"9wviCeWe2D8XS82k2ovp5EUYLzBt9pYNW2LXUFsZiv8S3Mt21FZ5qQaAroko1enzw3eGr9qC7X1D7Geoo2RrAotYPwq9Gm8","addressInfoLink":"https://explorer.zcha.in/accounts/9wviCeWe2D8XS82k2ovp5EUYLzBt9pYNW2LXUFsZiv8S3Mt21FZ5qQaAroko1enzw3eGr9qC7X1D7Geoo2RrAotYPwq9Gm8","poolStats":{"connectedMiners":0,"poolHashRate":0},"networkStats":{"networkType":"Test","networkHashRate":39.05,"networkDifficulty":2343,"lastNetworkBlockTime":"2017-09-17T10:35:55.0394813Z","blockHeight":157,"connectedPeers":2,"rewardType":"POW"}},{"id":"eth1","coin":{"type":"ETH"},"ports":{"4032":{"difficulty":1600,"varDiff":{"minDiff":1600,"maxDiff":160000,"targetTime":15,"retargetTime":90,"variancePercent":30}},"4256":{"difficulty":5000}},"paymentProcessing":{"enabled":true,"minimumPayment":0.01,"payoutScheme":"PPLNS","payoutSchemeConfig":{"factor":2},"minimumPaymentToPaymentId":5},"banning":{"enabled":true,"checkThreshold":50,"invalidPercent":50,"time":600},"clientConnectionTimeout":600,"jobRebroadcastTimeout":55,"blockRefreshInterval":1000,"poolFeePercent":0,"address":"9wviCeWe2D8XS82k2ovp5EUYLzBt9pYNW2LXUFsZiv8S3Mt21FZ5qQaAroko1enzw3eGr9qC7X1D7Geoo2RrAotYPwq9Gm8","addressInfoLink":"https://explorer.zcha.in/accounts/9wviCeWe2D8XS82k2ovp5EUYLzBt9pYNW2LXUFsZiv8S3Mt21FZ5qQaAroko1enzw3eGr9qC7X1D7Geoo2RrAotYPwq9Gm8","poolStats":{"connectedMiners":0,"poolHashRate":0},"networkStats":{"networkType":"Test","networkHashRate":39.05,"networkDifficulty":2343,"lastNetworkBlockTime":"2017-09-17T10:35:55.0394813Z","blockHeight":157,"connectedPeers":2,"rewardType":"POW"}}]}');//debug
//            data = JSON.parse(data);
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
        .always(function (data) {//debug,should be done()
//            data = JSON.parse('{"pools":[{"id":"xmr1","coin":{"type":"XMR"},"ports":{"4032":{"difficulty":1600,"varDiff":{"minDiff":1600,"maxDiff":160000,"targetTime":15,"retargetTime":90,"variancePercent":30}},"4256":{"difficulty":5000}},"paymentProcessing":{"enabled":true,"minimumPayment":0.01,"payoutScheme":"PPLNS","payoutSchemeConfig":{"factor":2},"minimumPaymentToPaymentId":5},"banning":{"enabled":true,"checkThreshold":50,"invalidPercent":50,"time":600},"clientConnectionTimeout":600,"jobRebroadcastTimeout":55,"blockRefreshInterval":1000,"poolFeePercent":0,"address":"9wviCeWe2D8XS82k2ovp5EUYLzBt9pYNW2LXUFsZiv8S3Mt21FZ5qQaAroko1enzw3eGr9qC7X1D7Geoo2RrAotYPwq9Gm8","addressInfoLink":"https://explorer.zcha.in/accounts/9wviCeWe2D8XS82k2ovp5EUYLzBt9pYNW2LXUFsZiv8S3Mt21FZ5qQaAroko1enzw3eGr9qC7X1D7Geoo2RrAotYPwq9Gm8","poolStats":{"connectedMiners":0,"poolHashRate":0},"networkStats":{"networkType":"Test","networkHashRate":39.05,"networkDifficulty":2343,"lastNetworkBlockTime":"2017-09-17T10:35:55.0394813Z","blockHeight":157,"connectedPeers":2,"rewardType":"POW"}},{"id":"eth1","coin":{"type":"ETH"},"ports":{"4032":{"difficulty":1600,"varDiff":{"minDiff":1600,"maxDiff":160000,"targetTime":15,"retargetTime":90,"variancePercent":30}},"4256":{"difficulty":5000}},"paymentProcessing":{"enabled":true,"minimumPayment":0.01,"payoutScheme":"PPLNS","payoutSchemeConfig":{"factor":2},"minimumPaymentToPaymentId":5},"banning":{"enabled":true,"checkThreshold":50,"invalidPercent":50,"time":600},"clientConnectionTimeout":600,"jobRebroadcastTimeout":55,"blockRefreshInterval":1000,"poolFeePercent":0,"address":"9wviCeWe2D8XS82k2ovp5EUYLzBt9pYNW2LXUFsZiv8S3Mt21FZ5qQaAroko1enzw3eGr9qC7X1D7Geoo2RrAotYPwq9Gm8","addressInfoLink":"https://explorer.zcha.in/accounts/9wviCeWe2D8XS82k2ovp5EUYLzBt9pYNW2LXUFsZiv8S3Mt21FZ5qQaAroko1enzw3eGr9qC7X1D7Geoo2RrAotYPwq9Gm8","poolStats":{"connectedMiners":0,"poolHashRate":0},"networkStats":{"networkType":"Test","networkHashRate":39.05,"networkDifficulty":2343,"lastNetworkBlockTime":"2017-09-17T10:35:55.0394813Z","blockHeight":157,"connectedPeers":2,"rewardType":"POW"}}]}');//debug
//            data = JSON.parse(data);
            $.each(data.pools, function (index, value) {
                if (currentPool === value.id) {
                    // poolShares
//                    $('#poolShares').text('0');//debug
                    // poolBlocks
//                    $('#poolBlocks').text('0');//debug
                    $('#poolMiners').text(value.poolStats.connectedMiners);
                    $('#poolHashRate').text(value.poolStats.poolHashRate + ' H/s');
                    $('#networkHashRate').text(value.networkStats.networkHashRate + ' H/s');
                    $('#networkDifficulty').text(value.networkStats.networkDifficulty);
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
        .always(function (data) {//debug,should be done()
//            data = JSON.parse('{"stats":[{"poolHashRate":20,"connectedMiners":12,"created":"2017-09-16T10:00:00"},{"poolHashRate":25,"connectedMiners":15,"created":"2017-09-16T11:00:00"},{"poolHashRate":23,"connectedMiners":13,"created":"2017-09-17T10:00:00"}]}');//debug
//            data = JSON.parse(data);
            labels = [];
            connectedMiners = [];
            networkHashRate = [];
            poolHashRate = [];
            maxHashRate = 0;

            $.each(data.stats, function (index, value) {
                labels.push(new Date(value.created).toLocaleTimeString());
                networkHashRate.push(value.networkHashRate);
//                networkHashRate.push(30);//debug
                poolHashRate.push(value.poolHashRate);
                /*
                if (value.networkHashRate > maxHashRate) {
                  maxHashRate = value.poolHashRate;
                }
                */
                if (value.poolHashRate > maxHashRate) {
                    maxHashRate = value.poolHashRate;
                }
                connectedMiners.push(value.connectedMiners);
            });

            var data = {
                labels: labels,
                series: [
                    networkHashRate,
                    poolHashRate,
                ],
            };

            var options = {
                low: 0,
                high: maxHashRate * 1.1,
                showArea: true,
                height: "245px",
                axisX: {
                    showGrid: false,
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
        .always(function (data) {//debug,should be done()
//            data = JSON.parse('{"pendingShares":354,"pendingBalance":1.456,"totalPaid":12.354}');//debug
//            data = JSON.parse(data);
            $('#pendingShares').text(data.pendingShares);
            
            $('#pendingBalance').text(data.pendingBalance);
            $('#lifetimeBalance').text(data.totalPaid);
                
                var sumHashrate = 0.0;
                if (data.performance.workers != null){
                $.each(data.performance.workers, function (index, value) {
                       sumHashrate += value.hashrate;
                       });
                }
                $('#minerHashRate').text(sumHashrate);
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
        .always(function (data) {//debug,should be done()
//            data = JSON.parse('{"stats":[{"poolHashRate":20,"connectedMiners":12,"created":"2017-09-16T10:00:00"},{"poolHashRate":25,"connectedMiners":15,"created":"2017-09-16T11:00:00"},{"poolHashRate":23,"connectedMiners":13,"created":"2017-09-17T10:00:00"}]}');//debug
//            data = JSON.parse(data);
            var workerList = '<thead><th>Name</th><th>Hash Rate</th><th>Shares per second</th></thead><tbody>';
            if (data.performance.workers != null) {
                $.each(data.performance.workers, function (index, value) {
                    workerList += '<tr>';
                    workerList += '<td>' + index + '</td>';
                    workerList += '<td>' + value.hashrate + '</td>';
                    workerList += '<td>' + value.sharesPerSecond + '</td>';
                    workerList += '</tr>'
                });
            } else {
                workerList += '<tr><td colspan="4">None</td></tr>';
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
        .always(function (data) {//debug,should be done()
//            data = JSON.parse('{"stats":[{"poolHashRate":20,"connectedMiners":12,"created":"2017-09-16T10:00:00"},{"poolHashRate":25,"connectedMiners":15,"created":"2017-09-16T11:00:00"},{"poolHashRate":23,"connectedMiners":13,"created":"2017-09-17T10:00:00"}]}');//debug
//            data = JSON.parse(data);
            labels = [];
            poolHashRate = [];
            minerHashRate = [];
            maxHashRate = 0;

//            $.each(data.stats, function (index, value) {
//                labels.push(new Date(value.created).toLocaleTimeString());
//                poolHashRate.push(value.poolHashRate);
////                minerHashRate.push(5);//debug
//                if (value.poolHashRate > maxHashRate) {
//                    maxHashRate = value.poolHashRate;
//                }
//                /*
//                if (value.minerHashRate > maxHashRate) {
//                  maxHashRate = value.minerHashRate;
//                }
//                */
//            });

            var data = {
                labels: labels,
                series: [
                    poolHashRate,
                    minerHashRate,
                ],
            };

            var options = {
                low: 0,
                high: maxHashRate * 1.1,
                showArea: true,
                height: "245px",
                axisX: {
                    showGrid: false,
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
        .always(function (data) {//debug,should be done()
//            data = JSON.parse('[{"blockHeight":197,"status":"pending","effort":1.4,"confirmationProgress":0.3,"transactionConfirmationData":"6e7f68c7891e0f2fdbfd0086d88be3b0d57f1d8f4e1cb78ddc509506e312d94d","reward":17.55888124174,"infoLink":"https://xmrchain.net/block/6e7f68c7891e0f2fdbfd0086d88be3b0d57f1d8f4e1cb78ddc509506e312d94d","created":"2017-09-16T07:41:50.242856"},{"blockHeight":196,"status":"confirmed","effort":0.85,"confirmationProgress":1,"transactionConfirmationData":"bb0b42b4936cfa210da7308938ad6d2d34c5339d45b61c750c1e0be2475ec039","reward":17.558898015821,"infoLink":"https://xmrchain.net/block/bb0b42b4936cfa210da7308938ad6d2d34c5339d45b61c750c1e0be2475ec039","created":"2017-09-16T07:41:39.664172"},{"blockHeight":195,"status":"orphaned","effort":2.24,"confirmationProgress":0,"transactionConfirmationData":"b9b5943b2646ebfd19311da8031c66b164ace54a7f74ff82556213d9b54daaeb","reward":17.558914789917,"infoLink":"https://xmrchain.net/block/b9b5943b2646ebfd19311da8031c66b164ace54a7f74ff82556213d9b54daaeb","created":"2017-09-16T07:41:14.457664"}]');//debug
            data = JSON.parse(data);
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
        .always(function (data) {//debug,should be done()
//            data = JSON.parse('[{"coin":"XMR","address":"9wviCeWe2D8XS82k2ovp5EUYLzBt9pYNW2LXUFsZiv8S3Mt21FZ5qQaAroko1enzw3eGr9qC7X1D7Geoo2RrAotYPwq9Gm8","addressInfoLink":"https://xmrchain.net/addr/9wviCeWe2D8XS82k2ovp5EUYLzBt9pYNW2LXUFsZiv8S3Mt21FZ5qQaAroko1enzw3eGr9qC7X1D7Geoo2RrAotYPwq9Gm8","amount":7.5354,"transactionConfirmationData":"9e7f68c7891e0f2fdbfd0086d88be3b0d57f1d8f4e1cb78ddc509506e312d94d","transactionInfoLink":"https://xmrchain.net/tx/9e7f68c7891e0f2fdbfd0086d88be3b0d57f1d8f4e1cb78ddc509506e312d94d","created":"2017-09-16T07:41:50.242856"}]');//debug
//            data = JSON.parse(data);
            var paymentList = '<thead><th>Date &amp; Time</th><th>Address</th><th>Amount</th><th>Confirmation</th></thead><tbody>';
            if (data.length > 0) {
                $.each(data, function (index, value) {
                    paymentList += '<tr>';
                    paymentList += '<td>' + new Date(value.created).toLocaleString() + '</td>';
                    paymentList += '<td><a href="' + value.addressInfoLink + '" target="_blank">' + value.address.substring(0, 10) + ' &hellip; ' + value.address.substring(value.address.length - 8) + '</td>';
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
        .always(function (data) {//debug,should be done()
//            data = JSON.parse('{"pools":[{"id":"xmr1","coin":{"type":"XMR"},"ports":{"4032":{"difficulty":1600,"varDiff":{"minDiff":1600,"maxDiff":160000,"targetTime":15,"retargetTime":90,"variancePercent":30}},"4256":{"difficulty":5000}},"paymentProcessing":{"enabled":true,"minimumPayment":0.01,"payoutScheme":"PPLNS","payoutSchemeConfig":{"factor":2},"minimumPaymentToPaymentId":5},"banning":{"enabled":true,"checkThreshold":50,"invalidPercent":50,"time":600},"clientConnectionTimeout":600,"jobRebroadcastTimeout":55,"blockRefreshInterval":1000,"poolFeePercent":0,"address":"9wviCeWe2D8XS82k2ovp5EUYLzBt9pYNW2LXUFsZiv8S3Mt21FZ5qQaAroko1enzw3eGr9qC7X1D7Geoo2RrAotYPwq9Gm8","addressInfoLink":"https://explorer.zcha.in/accounts/9wviCeWe2D8XS82k2ovp5EUYLzBt9pYNW2LXUFsZiv8S3Mt21FZ5qQaAroko1enzw3eGr9qC7X1D7Geoo2RrAotYPwq9Gm8","poolStats":{"connectedMiners":0,"poolHashRate":0},"networkStats":{"networkType":"Test","networkHashRate":39.05,"networkDifficulty":2343,"lastNetworkBlockTime":"2017-09-17T10:35:55.0394813Z","blockHeight":157,"connectedPeers":2,"rewardType":"POW"}},{"id":"eth1","coin":{"type":"ETH"},"ports":{"4032":{"difficulty":1600,"varDiff":{"minDiff":1600,"maxDiff":160000,"targetTime":15,"retargetTime":90,"variancePercent":30}},"4256":{"difficulty":5000}},"paymentProcessing":{"enabled":true,"minimumPayment":0.01,"payoutScheme":"PPLNS","payoutSchemeConfig":{"factor":2},"minimumPaymentToPaymentId":5},"banning":{"enabled":true,"checkThreshold":50,"invalidPercent":50,"time":600},"clientConnectionTimeout":600,"jobRebroadcastTimeout":55,"blockRefreshInterval":1000,"poolFeePercent":0,"address":"9wviCeWe2D8XS82k2ovp5EUYLzBt9pYNW2LXUFsZiv8S3Mt21FZ5qQaAroko1enzw3eGr9qC7X1D7Geoo2RrAotYPwq9Gm8","addressInfoLink":"https://explorer.zcha.in/accounts/9wviCeWe2D8XS82k2ovp5EUYLzBt9pYNW2LXUFsZiv8S3Mt21FZ5qQaAroko1enzw3eGr9qC7X1D7Geoo2RrAotYPwq9Gm8","poolStats":{"connectedMiners":0,"poolHashRate":0},"networkStats":{"networkType":"Test","networkHashRate":39.05,"networkDifficulty":2343,"lastNetworkBlockTime":"2017-09-17T10:35:55.0394813Z","blockHeight":157,"connectedPeers":2,"rewardType":"POW"}}]}');//debug
//            data = JSON.parse(data);
            var connectPoolConfig = '<thead><tr><th>Item</th><th>Value</th></tr></thead><tbody>';
            $.each(data.pools, function (index, value) {
                if (currentPool === value.id) {
                    connectPoolConfig += '<tr><td>Wallet Address</td><td><a href="' + value.addressInfoLink + '" target="_blank">' + value.address.substring(0, 10) + ' &hellip; ' + value.address.substring(value.address.length - 8) + '</a></td></tr>';
                    connectPoolConfig += '<tr><td>Payout Scheme</td><td>' + value.paymentProcessing.payoutScheme + '</td></tr>';
                    connectPoolConfig += '<tr><td>Minimum Payment w/o #</td><td>' + value.paymentProcessing.minimumPayment + ' ' + value.coin.type + '</td></tr>';
                    connectPoolConfig += '<tr><td>Minimum Payment w/ #</td><td>' + value.paymentProcessing.minimumPaymentToPaymentId + ' ' + value.coin.type + '</td></tr>';
                    connectPoolConfig += '<tr><td>Pool Fee</td><td>' + value.poolFeePercent + '%</td></tr>';
                    $.each(value.ports, function (port, options) {
                        connectPoolConfig += '<tr><td>Port ' + port + ' Difficulty</td><td>'
                        if (typeof(options.varDiff) !== "undefined") {
                            connectPoolConfig += 'Variable / ' + options.varDiff.minDiff + ' &harr; ' + options.varDiff.maxDiff;
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
