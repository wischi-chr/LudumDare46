/**
 * @version 1.0.0.0
 * @copyright Copyright ©  2020
 * @compiler Bridge.NET 17.10.1
 */
Bridge.assembly("Wischi.LD46.KeepItAlive.BridgeNet", function ($asm, globals) {
    "use strict";

    Bridge.define("Wischi.LD46.KeepItAlive.BridgeNet.Bootstrap", {
        statics: {
            fields: {
                rng: null,
                clock: null,
                config: null,
                treeStateFactory: null,
                treeStateStore: null,
                sharedDrawingState: null
            },
            ctors: {
                init: function () {
                    Bridge.ready(this.MainAsync);
                },
                ctor: function () {
                    Wischi.LD46.KeepItAlive.BridgeNet.Bootstrap.rng = new System.Random.ctor();
                    Wischi.LD46.KeepItAlive.BridgeNet.Bootstrap.clock = new Wischi.LD46.KeepItAlive.BridgeNet.BridgeClock();
                    Wischi.LD46.KeepItAlive.BridgeNet.Bootstrap.config = Wischi.LD46.KeepItAlive.BridgeNet.TreeEnvironmentConfigs.Release;
                    Wischi.LD46.KeepItAlive.BridgeNet.Bootstrap.sharedDrawingState = new Wischi.LD46.KeepItAlive.BridgeNet.SharedDrawingState();

                    Wischi.LD46.KeepItAlive.BridgeNet.Bootstrap.treeStateFactory = new Wischi.LD46.KeepItAlive.BridgeNet.TreeStateFactory(Wischi.LD46.KeepItAlive.BridgeNet.Bootstrap.rng, Wischi.LD46.KeepItAlive.BridgeNet.Bootstrap.clock, Wischi.LD46.KeepItAlive.BridgeNet.Bootstrap.config);
                    Wischi.LD46.KeepItAlive.BridgeNet.Bootstrap.treeStateStore = new Wischi.LD46.KeepItAlive.BridgeNet.TreeStateStore(Wischi.LD46.KeepItAlive.BridgeNet.Bootstrap.config.SettingPrefix);
                }
            },
            methods: {
                LoadImageAsync: function (src) {
                    var imageElement = new Image();
                    var completionSource = new System.Threading.Tasks.TaskCompletionSource();
                    imageElement.src = src;

                    imageElement.addEventListener("load", function () {
                        completionSource.setResult(imageElement);
                    });

                    return completionSource.task;
                },
                MigrateSettingsAsync: function () {
                    var $step = 0,
                        $task1, 
                        $jumpFromFinally, 
                        $tcs = new System.Threading.Tasks.TaskCompletionSource(), 
                        $returnValue, 
                        legacyStateStore, 
                        state, 
                        $async_e, 
                        $asyncBody = Bridge.fn.bind(this, function () {
                            try {
                                for (;;) {
                                    $step = System.Array.min([0,1,2,3], $step);
                                    switch ($step) {
                                        case 0: {
                                            legacyStateStore = new Wischi.LD46.KeepItAlive.BridgeNet.LocalStorageLegacyTreeStateStore(Wischi.LD46.KeepItAlive.BridgeNet.Bootstrap.config.SettingPrefix);

                                            state = legacyStateStore.Get();

                                            if (state != null) {
                                                $step = 1;
                                                continue;
                                            } 
                                            $step = 3;
                                            continue;
                                        }
                                        case 1: {
                                            $task1 = Wischi.LD46.KeepItAlive.BridgeNet.Bootstrap.treeStateStore.Set(state);
                                            $step = 2;
                                            if ($task1.isCompleted()) {
                                                continue;
                                            }
                                            $task1.continue($asyncBody);
                                            return;
                                        }
                                        case 2: {
                                            $task1.getAwaitedResult();
                                            legacyStateStore.RemoveLegacy();
                                            $step = 3;
                                            continue;
                                        }
                                        case 3: {
                                            $tcs.setResult(null);
                                            return;
                                        }
                                        default: {
                                            $tcs.setResult(null);
                                            return;
                                        }
                                    }
                                }
                            } catch($async_e1) {
                                $async_e = System.Exception.create($async_e1);
                                $tcs.setException($async_e);
                            }
                        }, arguments);

                    $asyncBody();
                    return $tcs.task;
                },
                SetHashAsSyncToken: function () {
                    var hs = window.location.hash;

                    if (System.String.startsWith(hs, "#")) {
                        hs = hs.substr(1);
                    }

                    if (!System.String.isNullOrWhiteSpace(hs)) {
                        Wischi.LD46.KeepItAlive.BridgeNet.Bootstrap.treeStateStore.SyncToken = hs;
                    } else {
                        window.location.hash = "#" + (Wischi.LD46.KeepItAlive.BridgeNet.Bootstrap.treeStateStore.SyncToken || "");
                    }
                },
                MainAsync: function () {
                    var $step = 0,
                        $task1, 
                        $task2, 
                        $task3, 
                        $jumpFromFinally, 
                        $tcs = new System.Threading.Tasks.TaskCompletionSource(), 
                        $returnValue, 
                        UpdateStateAndDraw, 
                        Draw, 
                        canvas, 
                        loader, 
                        context, 
                        waterTask, 
                        resetTask, 
                        autoSaveTask, 
                        water, 
                        reset, 
                        slider, 
                        drawer, 
                        $async_e, 
                        $asyncBody = Bridge.fn.bind(this, function () {
                            try {
                                for (;;) {
                                    $step = System.Array.min([0,1,2,3], $step);
                                    switch ($step) {
                                        case 0: {
                                            UpdateStateAndDraw = null;
                                            Draw = null;
                                            if (!(((canvas = Bridge.as(document.getElementById("canvas"), HTMLCanvasElement))) != null)) {
                                                System.Console.Write("Canvas not found. Exiting.");
                                                $tcs.setResult(null);
                                                return;
                                            }

                                            loader = new Wischi.LD46.KeepItAlive.BridgeNet.LoadingDrawer(canvas);
                                            loader.Draw();

                                            $task1 = Wischi.LD46.KeepItAlive.BridgeNet.Bootstrap.MigrateSettingsAsync();
                                            $step = 1;
                                            if ($task1.isCompleted()) {
                                                continue;
                                            }
                                            $task1.continue($asyncBody);
                                            return;
                                        }
                                        case 1: {
                                            $task1.getAwaitedResult();
                                            Wischi.LD46.KeepItAlive.BridgeNet.Bootstrap.SetHashAsSyncToken();

                                            Wischi.LD46.KeepItAlive.BridgeNet.Bootstrap.treeStateStore.addSyncTokenChanged(function (s, e) {
                                                window.location.hash = "#" + (Wischi.LD46.KeepItAlive.BridgeNet.Bootstrap.treeStateStore.SyncToken || "");
                                            });

                                            context = new Wischi.LD46.KeepItAlive.BridgeNet.TreeAppContext(Wischi.LD46.KeepItAlive.BridgeNet.Bootstrap.clock, Wischi.LD46.KeepItAlive.BridgeNet.Bootstrap.config, Wischi.LD46.KeepItAlive.BridgeNet.Bootstrap.treeStateStore, Wischi.LD46.KeepItAlive.BridgeNet.Bootstrap.treeStateFactory, Wischi.LD46.KeepItAlive.BridgeNet.Bootstrap.sharedDrawingState);

                                            $task2 = context.InitializeAsync();
                                            $step = 2;
                                            if ($task2.isCompleted()) {
                                                continue;
                                            }
                                            $task2.continue($asyncBody);
                                            return;
                                        }
                                        case 2: {
                                            $task2.getAwaitedResult();
                                            context.UpdateGameState();

                                            waterTask = Wischi.LD46.KeepItAlive.BridgeNet.Bootstrap.LoadImageAsync("img/water.png");
                                            resetTask = Wischi.LD46.KeepItAlive.BridgeNet.Bootstrap.LoadImageAsync("img/reset.png");
                                            autoSaveTask = context.AutoSave();

                                            $task3 = System.Threading.Tasks.Task.whenAll(waterTask, resetTask, autoSaveTask);
                                            $step = 3;
                                            if ($task3.isCompleted()) {
                                                continue;
                                            }
                                            $task3.continue($asyncBody);
                                            return;
                                        }
                                        case 3: {
                                            $task3.getAwaitedResult();
                                            water = waterTask.getResult();
                                            reset = resetTask.getResult();
                                            if (((slider = Bridge.as(document.getElementById("slider"), HTMLInputElement))) != null) {
                                                slider.addEventListener("input", function () {
                                                    var factor = System.Int32.parse(slider.value) / 100.0;
                                                    context.TreeBehaviour.TreeState.Growth = factor;
                                                });
                                            }

                                            drawer = new Wischi.LD46.KeepItAlive.BridgeNet.TreeDrawer(canvas, water, reset, Wischi.LD46.KeepItAlive.BridgeNet.Bootstrap.sharedDrawingState);
                                            Draw = function () {
                                                context.UpdatePreRender();
                                                drawer.Draw();
                                            };
                                            UpdateStateAndDraw = function () {
                                                context.UpdateGameState();
                                                Draw();
                                            };

                                            window.onhashchange = function (_) {
                                                var $step = 0,
                                                    $task1, 
                                                    $jumpFromFinally, 
                                                    $asyncBody = Bridge.fn.bind(this, function () {
                                                        for (;;) {
                                                            $step = System.Array.min([0,1], $step);
                                                            switch ($step) {
                                                                case 0: {
                                                                    Wischi.LD46.KeepItAlive.BridgeNet.Bootstrap.SetHashAsSyncToken();
                                                                    $task1 = context.InitializeAsync();
                                                                    $step = 1;
                                                                    if ($task1.isCompleted()) {
                                                                        continue;
                                                                    }
                                                                    $task1.continue($asyncBody);
                                                                    return;
                                                                }
                                                                case 1: {
                                                                    $task1.getAwaitedResult();
                                                                    UpdateStateAndDraw();
                                                                    return;
                                                                }
                                                                default: {
                                                                    return;
                                                                }
                                                            }
                                                        }
                                                    }, arguments);

                                                $asyncBody();
                                            };





                                            water.addEventListener("load", UpdateStateAndDraw);

                                            canvas.addEventListener("click", function (e) {
                                                var $step = 0,
                                                    $task1, 
                                                    $task2, 
                                                    $jumpFromFinally, 
                                                    me, 
                                                    xx, 
                                                    yy, 
                                                    $asyncBody = Bridge.fn.bind(this, function () {
                                                        for (;;) {
                                                            $step = System.Array.min([0,1,2,3,4,5,6,7], $step);
                                                            switch ($step) {
                                                                case 0: {
                                                                    if (!(((me = Bridge.as(e, MouseEvent))) != null)) {
                                                                        return;
                                                                    }

                                                                    var rect = e.target.getBoundingClientRect();
                                                                    var x = Math.floor(e.clientX - rect.left);
                                                                    var y = Math.floor(e.clientY - rect.top);

                                                                    xx = x;
                                                                    yy = y;

                                                                    if (xx <= 80 && yy >= 430) {
                                                                        $step = 1;
                                                                        continue;
                                                                    } 
                                                                    $step = 7;
                                                                    continue;
                                                                }
                                                                case 1: {
                                                                    if (context.TreeBehaviour.TreeState.Health === 0) {
                                                                        $step = 2;
                                                                        continue;
                                                                    } else  {
                                                                        $step = 4;
                                                                        continue;
                                                                    }
                                                                }
                                                                case 2: {
                                                                    $task1 = context.ResetTreeAsync();
                                                                    $step = 3;
                                                                    if ($task1.isCompleted()) {
                                                                        continue;
                                                                    }
                                                                    $task1.continue($asyncBody);
                                                                    return;
                                                                }
                                                                case 3: {
                                                                    $task1.getAwaitedResult();
                                                                    $step = 6;
                                                                    continue;
                                                                }
                                                                case 4: {
                                                                    $task2 = context.WaterAsync();
                                                                    $step = 5;
                                                                    if ($task2.isCompleted()) {
                                                                        continue;
                                                                    }
                                                                    $task2.continue($asyncBody);
                                                                    return;
                                                                }
                                                                case 5: {
                                                                    $task2.getAwaitedResult();
                                                                    $step = 6;
                                                                    continue;
                                                                }
                                                                case 6: {
                                                                    UpdateStateAndDraw();
                                                                    $step = 7;
                                                                    continue;
                                                                }
                                                                case 7: {
                                                                    return;
                                                                }
                                                                default: {
                                                                    return;
                                                                }
                                                            }
                                                        }
                                                    }, arguments);

                                                $asyncBody();
                                            });

                                            window.setInterval(Draw, Wischi.LD46.KeepItAlive.BridgeNet.Bootstrap.config.MsRefreshRate);
                                            window.setInterval(Bridge.fn.cacheBind(context, context.UpdateGameState), Wischi.LD46.KeepItAlive.BridgeNet.Bootstrap.config.MsTickRate);
                                            window.setInterval(function () {
                                                Bridge._ = context.AutoSave();
                                            }, Wischi.LD46.KeepItAlive.BridgeNet.Bootstrap.config.MsAutoSave);

                                            UpdateStateAndDraw();
                                            $tcs.setResult(null);
                                            return;
                                        }
                                        default: {
                                            $tcs.setResult(null);
                                            return;
                                        }
                                    }
                                }
                            } catch($async_e1) {
                                $async_e = System.Exception.create($async_e1);
                                $tcs.setException($async_e);
                            }
                        }, arguments);

                    $asyncBody();
                    return $tcs.task;
                }
            }
        },
        $entryPoint: true
    });

    Bridge.define("Wischi.LD46.KeepItAlive.BridgeNet.IClock", {
        $kind: "interface"
    });

    Bridge.define("Wischi.LD46.KeepItAlive.BridgeNet.EasingHelper", {
        statics: {
            methods: {
                EaseOutSine: function (x) {
                    return Math.sin(x * Math.PI / 2);
                },
                EaseOutQuad: function (x) {
                    return 1 - (1 - x) * (1 - x);
                },
                EaseOutQuint: function (x) {
                    return 1 - Math.pow(1 - x, 5);
                },
                EaseInQuad: function (x) {
                    return x * x * x * x;
                },
                EaseInQuadOffset: function (x) {
                    x = x * 0.5 + 0.5;
                    return x * x * x * x;
                },
                EaseLinear: function (x) {
                    return x;
                },
                EaseInExp: function (factor) {
                    if (factor <= 0) {
                        return 0;
                    }

                    return Math.pow(2, 10 * factor - 10);
                }
            }
        }
    });

    Bridge.define("Wischi.LD46.KeepItAlive.BridgeNet.HttpResponse", {
        fields: {
            StatusCode: 0,
            Content: null
        },
        ctors: {
            ctor: function (statusCode, content) {
                this.$initialize();
                this.StatusCode = statusCode;
                this.Content = content;
            }
        }
    });

    Bridge.define("Wischi.LD46.KeepItAlive.BridgeNet.ITreeStateStore", {
        $kind: "interface"
    });

    Bridge.define("Wischi.LD46.KeepItAlive.BridgeNet.KVS", {
        statics: {
            fields: {
                baseUrl: null,
                baseUrlLen: 0,
                suffix: null
            },
            ctors: {
                init: function () {
                    this.baseUrl = "https://api.keyvalue.xyz/";
                    this.baseUrlLen = 25;
                    this.suffix = "tree";
                }
            },
            methods: {
                GetCompletionSourceForRequest: function (xhr) {
                    var source = new System.Threading.Tasks.TaskCompletionSource();

                    xhr.onload = function (a) {
                        var res = new Wischi.LD46.KeepItAlive.BridgeNet.HttpResponse(xhr.status, xhr.responseText);
                        source.setResult(res);
                    };

                    xhr.onabort = function (a) {
                        source.setCanceled();
                    };
                    xhr.onerror = function (a) {
                        source.setException(new System.Exception("Error"));
                    };
                    xhr.ontimeout = function (a) {
                        source.setException(new System.Exception("Timeout"));
                    };

                    return source;
                },
                GetUrlWithToken: function (token) {
                    return System.String.format("{0}{1}/{2}", Wischi.LD46.KeepItAlive.BridgeNet.KVS.baseUrl, token, Wischi.LD46.KeepItAlive.BridgeNet.KVS.suffix);
                },
                GetTokenFromUrl: function (url) {
                    var path = url.substr(Wischi.LD46.KeepItAlive.BridgeNet.KVS.baseUrlLen);
                    var indexSlash = System.String.indexOf(path, String.fromCharCode(47));
                    return path.substr(0, indexSlash);
                }
            }
        },
        methods: {
            NewAsync: function () {
                var $step = 0,
                    $task1, 
                    $taskResult1, 
                    $jumpFromFinally, 
                    $tcs = new System.Threading.Tasks.TaskCompletionSource(), 
                    $returnValue, 
                    url, 
                    xhr, 
                    source, 
                    resp, 
                    $async_e, 
                    $asyncBody = Bridge.fn.bind(this, function () {
                        try {
                            for (;;) {
                                $step = System.Array.min([0,1], $step);
                                switch ($step) {
                                    case 0: {
                                        url = Wischi.LD46.KeepItAlive.BridgeNet.KVS.GetUrlWithToken("new");

                                        xhr = new XMLHttpRequest();
                                        xhr.open("POST", url);

                                        source = Wischi.LD46.KeepItAlive.BridgeNet.KVS.GetCompletionSourceForRequest(xhr);
                                        xhr.send();

                                        $task1 = source.task;
                                        $step = 1;
                                        if ($task1.isCompleted()) {
                                            continue;
                                        }
                                        $task1.continue($asyncBody);
                                        return;
                                    }
                                    case 1: {
                                        $taskResult1 = $task1.getAwaitedResult();
                                        resp = $taskResult1;

                                        if (resp.StatusCode !== 200) {
                                            $tcs.setResult(resp);
                                            return;
                                        }

                                        $tcs.setResult(new Wischi.LD46.KeepItAlive.BridgeNet.HttpResponse(200, Wischi.LD46.KeepItAlive.BridgeNet.KVS.GetTokenFromUrl(resp.Content)));
                                        return;
                                    }
                                    default: {
                                        $tcs.setResult(null);
                                        return;
                                    }
                                }
                            }
                        } catch($async_e1) {
                            $async_e = System.Exception.create($async_e1);
                            $tcs.setException($async_e);
                        }
                    }, arguments);

                $asyncBody();
                return $tcs.task;
            },
            GetAsync: function (token) {
                var url = Wischi.LD46.KeepItAlive.BridgeNet.KVS.GetUrlWithToken(token);

                var xhr = new XMLHttpRequest();
                xhr.open("GET", url);

                var source = Wischi.LD46.KeepItAlive.BridgeNet.KVS.GetCompletionSourceForRequest(xhr);
                xhr.send();

                return source.task;
            },
            SetAsync: function (token, value) {
                var url = Wischi.LD46.KeepItAlive.BridgeNet.KVS.GetUrlWithToken(token);

                var xhr = new XMLHttpRequest();
                xhr.open("POST", url);

                var source = Wischi.LD46.KeepItAlive.BridgeNet.KVS.GetCompletionSourceForRequest(xhr);
                xhr.send(value);

                return source.task;
            }
        }
    });

    Bridge.define("Wischi.LD46.KeepItAlive.BridgeNet.LoadingDrawer", {
        fields: {
            ctx: null
        },
        ctors: {
            ctor: function (canvas) {
                this.$initialize();
                this.ctx = canvas.getContext("2d");
            }
        },
        methods: {
            Draw: function () {
                this.ctx.fillStyle = "#B2FFFF";
                this.ctx.clearRect(0, 0, 512, 512);
                this.ctx.fillRect(0, 0, 512, 512);

                this.ctx.fillStyle = "#000";
                this.ctx.font = "bold 16px Arial, sans-serif";

                this.ctx.fillText("Loading...", 7, 20);
            }
        }
    });

    Bridge.define("Wischi.LD46.KeepItAlive.BridgeNet.SharedDrawingState", {
        fields: {
            GrowthControl: 0,
            WaterAmount: 0,
            ThicknessControl: 0,
            WaterDelta: 0,
            IsDead: false,
            Seed: 0
        }
    });

    Bridge.define("Wischi.LD46.KeepItAlive.BridgeNet.TaskX", {
        statics: {
            fields: {
                CompletedTask: null
            },
            ctors: {
                init: function () {
                    this.CompletedTask = System.Threading.Tasks.Task.delay(0);
                }
            }
        }
    });

    Bridge.define("Wischi.LD46.KeepItAlive.BridgeNet.TreeAppContext", {
        fields: {
            clock: null,
            config: null,
            treeStateStore: null,
            treeStateFactory: null,
            sharedDrawingState: null,
            TreeBehaviour: null
        },
        ctors: {
            ctor: function (clock, config, treeStateStore, treeStateFactory, sharedDrawingState) {
                this.$initialize();
                this.clock = clock || (function () {
                    throw new System.ArgumentNullException.$ctor1("clock");
                })();
                this.config = config || (function () {
                    throw new System.ArgumentNullException.$ctor1("config");
                })();
                this.treeStateStore = treeStateStore || (function () {
                    throw new System.ArgumentNullException.$ctor1("treeStateStore");
                })();
                this.treeStateFactory = treeStateFactory || (function () {
                    throw new System.ArgumentNullException.$ctor1("treeStateFactory");
                })();
                this.sharedDrawingState = sharedDrawingState || (function () {
                    throw new System.ArgumentNullException.$ctor1("sharedDrawingState");
                })();
            }
        },
        methods: {
            InitializeAsync: function () {
                var $step = 0,
                    $task1, 
                    $taskResult1, 
                    $task2, 
                    $jumpFromFinally, 
                    $tcs = new System.Threading.Tasks.TaskCompletionSource(), 
                    $returnValue, 
                    state, 
                    $async_e, 
                    $asyncBody = Bridge.fn.bind(this, function () {
                        try {
                            for (;;) {
                                $step = System.Array.min([0,1,2,3,4], $step);
                                switch ($step) {
                                    case 0: {
                                        $task1 = this.treeStateStore.Get();
                                        $step = 1;
                                        if ($task1.isCompleted()) {
                                            continue;
                                        }
                                        $task1.continue($asyncBody);
                                        return;
                                    }
                                    case 1: {
                                        $taskResult1 = $task1.getAwaitedResult();
                                        state = $taskResult1;

                                        if (state == null) {
                                            $step = 2;
                                            continue;
                                        } 
                                        $step = 4;
                                        continue;
                                    }
                                    case 2: {
                                        state = this.treeStateFactory.CreateTree();
                                        $task2 = this.treeStateStore.Set(state);
                                        $step = 3;
                                        if ($task2.isCompleted()) {
                                            continue;
                                        }
                                        $task2.continue($asyncBody);
                                        return;
                                    }
                                    case 3: {
                                        $task2.getAwaitedResult();
                                        $step = 4;
                                        continue;
                                    }
                                    case 4: {
                                        this.TreeBehaviour = new Wischi.LD46.KeepItAlive.BridgeNet.TreeBehaviourEngine(this.config, state);
                                        $tcs.setResult(null);
                                        return;
                                    }
                                    default: {
                                        $tcs.setResult(null);
                                        return;
                                    }
                                }
                            }
                        } catch($async_e1) {
                            $async_e = System.Exception.create($async_e1);
                            $tcs.setException($async_e);
                        }
                    }, arguments);

                $asyncBody();
                return $tcs.task;
            },
            ResetTreeAsync: function () {
                var $step = 0,
                    $task1, 
                    $jumpFromFinally, 
                    $tcs = new System.Threading.Tasks.TaskCompletionSource(), 
                    $returnValue, 
                    state, 
                    $async_e, 
                    $asyncBody = Bridge.fn.bind(this, function () {
                        try {
                            for (;;) {
                                $step = System.Array.min([0,1], $step);
                                switch ($step) {
                                    case 0: {
                                        state = this.treeStateFactory.CreateTree();
                                        $task1 = this.treeStateStore.Set(state);
                                        $step = 1;
                                        if ($task1.isCompleted()) {
                                            continue;
                                        }
                                        $task1.continue($asyncBody);
                                        return;
                                    }
                                    case 1: {
                                        $task1.getAwaitedResult();
                                        this.TreeBehaviour = new Wischi.LD46.KeepItAlive.BridgeNet.TreeBehaviourEngine(this.config, state);
                                        $tcs.setResult(null);
                                        return;
                                    }
                                    default: {
                                        $tcs.setResult(null);
                                        return;
                                    }
                                }
                            }
                        } catch($async_e1) {
                            $async_e = System.Exception.create($async_e1);
                            $tcs.setException($async_e);
                        }
                    }, arguments);

                $asyncBody();
                return $tcs.task;
            },
            UpdateGameState: function () {
                this.TreeBehaviour.Update(this.clock.Wischi$LD46$KeepItAlive$BridgeNet$IClock$Now());
            },
            UpdatePreRender: function () {
                this.sharedDrawingState.GrowthControl = this.TreeBehaviour.TreeState.Growth;
                this.sharedDrawingState.WaterAmount = Math.min(1, this.TreeBehaviour.TreeState.WaterLevel);
                this.sharedDrawingState.ThicknessControl = this.TreeBehaviour.TreeState.Health;
                this.sharedDrawingState.WaterDelta = this.TreeBehaviour.WaterDelta;
                this.sharedDrawingState.IsDead = this.TreeBehaviour.TreeState.Health === 0;
            },
            WaterAsync: function () {
                var $step = 0,
                    $task1, 
                    $jumpFromFinally, 
                    $tcs = new System.Threading.Tasks.TaskCompletionSource(), 
                    $returnValue, 
                    $async_e, 
                    $asyncBody = Bridge.fn.bind(this, function () {
                        try {
                            for (;;) {
                                $step = System.Array.min([0,1], $step);
                                switch ($step) {
                                    case 0: {
                                        this.TreeBehaviour.Water();
                                        $task1 = this.treeStateStore.Set(this.TreeBehaviour.TreeState);
                                        $step = 1;
                                        if ($task1.isCompleted()) {
                                            continue;
                                        }
                                        $task1.continue($asyncBody);
                                        return;
                                    }
                                    case 1: {
                                        $task1.getAwaitedResult();
                                        $tcs.setResult(null);
                                        return;
                                    }
                                    default: {
                                        $tcs.setResult(null);
                                        return;
                                    }
                                }
                            }
                        } catch($async_e1) {
                            $async_e = System.Exception.create($async_e1);
                            $tcs.setException($async_e);
                        }
                    }, arguments);

                $asyncBody();
                return $tcs.task;
            },
            AutoSave: function () {
                var $step = 0,
                    $task1, 
                    $jumpFromFinally, 
                    $tcs = new System.Threading.Tasks.TaskCompletionSource(), 
                    $returnValue, 
                    $async_e, 
                    $asyncBody = Bridge.fn.bind(this, function () {
                        try {
                            for (;;) {
                                $step = System.Array.min([0,1], $step);
                                switch ($step) {
                                    case 0: {
                                        $task1 = this.treeStateStore.Set(this.TreeBehaviour.TreeState);
                                        $step = 1;
                                        if ($task1.isCompleted()) {
                                            continue;
                                        }
                                        $task1.continue($asyncBody);
                                        return;
                                    }
                                    case 1: {
                                        $task1.getAwaitedResult();
                                        $tcs.setResult(null);
                                        return;
                                    }
                                    default: {
                                        $tcs.setResult(null);
                                        return;
                                    }
                                }
                            }
                        } catch($async_e1) {
                            $async_e = System.Exception.create($async_e1);
                            $tcs.setException($async_e);
                        }
                    }, arguments);

                $asyncBody();
                return $tcs.task;
            }
        }
    });

    Bridge.define("Wischi.LD46.KeepItAlive.BridgeNet.TreeBehaviourEngine", {
        fields: {
            rndSource: null,
            config: null,
            WaterDelta: 0,
            TreeState: null
        },
        props: {
            IsHealthy: {
                get: function () {
                    return this.TreeState.WaterLevel > 0.001 && this.TreeState.WaterLevel <= 1;
                }
            }
        },
        ctors: {
            ctor: function (config, treeState) {
                this.$initialize();
                this.config = config || (function () {
                    throw new System.ArgumentNullException.$ctor1("config");
                })();
                this.TreeState = treeState || (function () {
                    throw new System.ArgumentNullException.$ctor1("treeState");
                })();

                this.WaterDelta = 0.125;
                this.rndSource = new Wischi.LD46.KeepItAlive.RandomWrapper(treeState.Seed);
            }
        },
        methods: {
            Water: function () {
                var $t;
                $t = this.TreeState;
                $t.WaterLevel += this.WaterDelta;
            },
            Update: function (now) {
                var targetTicks = Bridge.Int.clip32((now - this.TreeState.StartTimestamp) / this.config.MsTickRate);
                var delta = System.Int64(targetTicks).sub(this.TreeState.Ticks);

                for (var i = 0; System.Int64(i).lt(delta); i = (i + 1) | 0) {
                    this.Tick();

                    if (this.TreeState.Health <= 0) {
                        break;
                    }
                }

                this.TreeState.LastEventTimestamp = now;
            },
            Tick: function () {
                this.TreeState.Ticks = this.TreeState.Ticks.inc();

                this.GrowthTick();
                this.WaterTick();
                this.HealthTick();
            },
            GrowthTick: function () {
                var $t;
                if (this.TreeState.Growth >= 1) {
                    this.TreeState.Growth = 1;
                } else {
                    $t = this.TreeState;
                    $t.Growth += this.config.MaxGrowthRate * this.TreeState.Health;
                }
            },
            WaterTick: function () {
                var $t;
                var wDelta = this.config.MaxWaterRate - this.config.MinWaterRate;
                var waterAmount = this.rndSource.NextDouble() * wDelta + this.config.MinWaterRate;
                $t = this.TreeState;
                $t.WaterLevel -= waterAmount;

                if (this.TreeState.WaterLevel < 0) {
                    this.TreeState.WaterLevel = 0;
                }
            },
            HealthTick: function () {
                var $t, $t1;
                if (this.TreeState.Health <= 0) {
                    this.TreeState.Health = 0;
                    return;
                }

                if (this.IsHealthy) {
                    $t = this.TreeState;
                    $t.Health += this.config.HealRate;
                } else {
                    $t1 = this.TreeState;
                    $t1.Health -= this.config.HarmRate;
                }

                if (this.TreeState.Health < 0) {
                    this.TreeState.Health = 0;
                } else if (this.TreeState.Health > 1) {
                    this.TreeState.Health = 1;
                }
            }
        }
    });

    Bridge.define("Wischi.LD46.KeepItAlive.BridgeNet.TreeDrawer", {
        statics: {
            fields: {
                CanvasWidth: 0,
                CanvasHeight: 0,
                ScaleFactor: 0,
                TreeYOffset: 0
            },
            ctors: {
                init: function () {
                    this.CanvasWidth = 512;
                    this.CanvasHeight = 512;
                    this.ScaleFactor = 80;
                    this.TreeYOffset = 420;
                }
            }
        },
        fields: {
            ctx: null,
            rnd: null,
            treeDrawingContext: null,
            water: null,
            reset: null,
            sharedDrawingState: null,
            trunk: null,
            grassRandom: null,
            currentSeed: null,
            waterInfoWasShown: false,
            waterInfoDeactivated: false
        },
        props: {
            SkyColor: {
                get: function () {
                    return this.sharedDrawingState.IsDead ? "#444" : "#B2FFFF";
                }
            },
            GrassBackgroundColor: {
                get: function () {
                    return this.sharedDrawingState.IsDead ? "#333" : "#7EC850";
                }
            },
            GrassColor: {
                get: function () {
                    return this.sharedDrawingState.IsDead ? "#111" : "#206411";
                }
            }
        },
        ctors: {
            init: function () {
                this.rnd = new System.Random.ctor();
                this.waterInfoWasShown = false;
                this.waterInfoDeactivated = false;
            },
            ctor: function (canvas, water, reset, sharedDrawingState) {
                var $t;
                this.$initialize();
                this.water = water || (function () {
                    throw new System.ArgumentNullException.$ctor1("water");
                })();
                this.reset = reset || (function () {
                    throw new System.ArgumentNullException.$ctor1("reset");
                })();
                this.sharedDrawingState = sharedDrawingState || (function () {
                    throw new System.ArgumentNullException.$ctor1("sharedDrawingState");
                })();

                canvas.width = Wischi.LD46.KeepItAlive.BridgeNet.TreeDrawer.CanvasWidth;
                canvas.height = Wischi.LD46.KeepItAlive.BridgeNet.TreeDrawer.CanvasHeight;

                this.ctx = canvas.getContext("2d");

                this.treeDrawingContext = ($t = new Wischi.LD46.KeepItAlive.BridgeNet.TreeDrawingContext(this.ctx), $t.ScaleFactor = Wischi.LD46.KeepItAlive.BridgeNet.TreeDrawer.ScaleFactor, $t.StartX = 256, $t.StartY = Wischi.LD46.KeepItAlive.BridgeNet.TreeDrawer.TreeYOffset, $t.LeafLimit = 0.02, $t);
            }
        },
        methods: {
            UpdateSeed: function (newSeed) {
                var treeRndSource = new Wischi.LD46.KeepItAlive.RandomWrapper(newSeed);
                var treeBuilder = new Wischi.LD46.KeepItAlive.TreeBuilder(treeRndSource);

                this.trunk = treeBuilder.BuildTree();
                this.grassRandom = new Wischi.LD46.KeepItAlive.RandomWrapper(newSeed);
            },
            Draw: function () {
                if (System.Nullable.neq(this.sharedDrawingState.Seed, this.currentSeed)) {
                    this.UpdateSeed(this.sharedDrawingState.Seed);
                    this.currentSeed = this.sharedDrawingState.Seed;
                }

                if (this.currentSeed == null) {
                    return;
                }

                this.grassRandom.Reset();

                this.ctx.fillStyle = this.SkyColor;
                this.ctx.clearRect(0, 0, 512, 512);
                this.ctx.fillRect(0, 0, 512, 512);

                this.treeDrawingContext.GrowthFactor = Wischi.LD46.KeepItAlive.BridgeNet.EasingHelper.EaseOutQuad(this.sharedDrawingState.GrowthControl * 0.75 + 0.25);
                this.treeDrawingContext.LeafFactor = this.sharedDrawingState.ThicknessControl * 0.9;
                this.treeDrawingContext.IsDead = this.sharedDrawingState.IsDead;

                var grassHeight = 370;
                this.ctx.fillStyle = this.GrassBackgroundColor;
                this.ctx.fillRect(0, grassHeight, Wischi.LD46.KeepItAlive.BridgeNet.TreeDrawer.CanvasWidth, ((Wischi.LD46.KeepItAlive.BridgeNet.TreeDrawer.CanvasHeight - grassHeight) | 0));

                var grassForegroundLimit = 400;

                for (var y = (grassHeight - 10) | 0; y < grassForegroundLimit; y = (y + 5) | 0) {
                    this.DrawGrass(y, 512);
                }

                this.treeDrawingContext.DrawTree(this.trunk);

                for (var y1 = grassForegroundLimit; y1 < Wischi.LD46.KeepItAlive.BridgeNet.TreeDrawer.CanvasHeight; y1 = (y1 + 5) | 0) {
                    this.DrawGrass(y1, 512);
                }

                this.DrawWaterHUD();
            },
            DrawWaterHUD: function () {
                var height = 30;
                var margin = 10;
                var marginLeft = 50;
                var marginBottom = 20;
                var padding = 5;

                var waterPredition = 0;

                if (this.sharedDrawingState.WaterAmount + this.sharedDrawingState.WaterDelta > 1) {
                    waterPredition = 1;
                }

                if (!this.sharedDrawingState.IsDead) {
                    this.ctx.fillStyle = "#B2FFFF60";
                    this.ctx.fillRect(((0 + marginLeft) | 0), ((((((Wischi.LD46.KeepItAlive.BridgeNet.TreeDrawer.CanvasHeight - marginBottom) | 0) - Bridge.Int.mul(2, padding)) | 0) - height) | 0), ((((Wischi.LD46.KeepItAlive.BridgeNet.TreeDrawer.CanvasWidth - margin) | 0) - marginLeft) | 0), ((height + Bridge.Int.mul(2, padding)) | 0));

                    this.ctx.fillStyle = "#0077BE80";
                    this.ctx.fillRect(((((0 + marginLeft) | 0) + padding) | 0), ((((((Wischi.LD46.KeepItAlive.BridgeNet.TreeDrawer.CanvasHeight - marginBottom) | 0) - padding) | 0) - height) | 0), Bridge.Int.mul((((((((Wischi.LD46.KeepItAlive.BridgeNet.TreeDrawer.CanvasWidth - Bridge.Int.mul(2, padding)) | 0) - margin) | 0) - marginLeft) | 0)), waterPredition), height);

                    this.ctx.fillStyle = "#0077BE";
                    this.ctx.fillRect(((((0 + marginLeft) | 0) + padding) | 0), ((((((Wischi.LD46.KeepItAlive.BridgeNet.TreeDrawer.CanvasHeight - marginBottom) | 0) - padding) | 0) - height) | 0), (((((((Wischi.LD46.KeepItAlive.BridgeNet.TreeDrawer.CanvasWidth - Bridge.Int.mul(2, padding)) | 0) - margin) | 0) - marginLeft) | 0)) * this.sharedDrawingState.WaterAmount, height);
                }

                var icon = this.water;
                var iconLeft = 5;

                if (this.sharedDrawingState.IsDead) {
                    iconLeft = 20;
                    icon = this.reset;
                }

                this.ctx.imageSmoothingEnabled = true;
                this.ctx.drawImage(icon, iconLeft, 433, 64.0, 64.0);

                this.ctx.fillStyle = "#000";
                this.ctx.font = "bold 16px Arial, sans-serif";

                var text = "";

                if (!this.sharedDrawingState.IsDead) {
                    var lastWaterinfo = this.waterInfoWasShown;
                    this.waterInfoWasShown = false;

                    if ((this.sharedDrawingState.WaterAmount < 0.5 && !this.waterInfoDeactivated) || this.sharedDrawingState.WaterAmount < 0.001) {
                        text = "\u2bc7 click to water your tree";
                        this.waterInfoWasShown = true;
                    } else if (this.sharedDrawingState.WaterAmount > 0.999) {
                        text = "swamped";
                    }

                    if (lastWaterinfo && !this.waterInfoWasShown) {
                        this.waterInfoDeactivated = true;
                    }
                } else {
                    this.ctx.font = "bold 24px Arial, sans-serif";
                    marginLeft = (marginLeft + 30) | 0;
                }

                this.ctx.fillText(text, ((((marginLeft + padding) | 0) + 15) | 0), ((((((Wischi.LD46.KeepItAlive.BridgeNet.TreeDrawer.CanvasHeight - marginBottom) | 0) - padding) | 0) - 10) | 0));
            },
            DrawGrass: function (y, amount) {
                var grassScale = 16.0;

                this.ctx.strokeStyle = this.GrassColor;
                this.ctx.lineWidth = grassScale * 0.025;

                this.ctx.beginPath();

                for (var i = 0; i < amount; i = (i + 1) | 0) {

                    var x = this.grassRandom.NextDouble() * Wischi.LD46.KeepItAlive.BridgeNet.TreeDrawer.CanvasWidth;

                    var offsetx = this.grassRandom.NextDouble() - 0.5;
                    var offsetY = this.grassRandom.NextDouble() - 0.5;
                    var height = this.grassRandom.NextDouble() * 0.7 + 0.3;

                    this.ctx.moveTo(x, y + offsetY * grassScale);
                    this.ctx.lineTo(x + offsetx * grassScale, y + offsetY * grassScale + height * grassScale);
                }

                this.ctx.closePath();
                this.ctx.stroke();
            }
        }
    });

    Bridge.define("Wischi.LD46.KeepItAlive.BridgeNet.TreeDrawingContext", {
        statics: {
            fields: {
                TAU: 0
            },
            ctors: {
                init: function () {
                    this.TAU = 6.2831853071795862;
                }
            }
        },
        fields: {
            ctx: null,
            GrowthFactor: 0,
            ScaleFactor: 0,
            LeafLimit: 0,
            StartX: 0,
            StartY: 0,
            LeafFactor: 0,
            IsDead: false
        },
        props: {
            DepthLimit: {
                get: function () {
                    return 12;
                }
            },
            ThicknessLimit: {
                get: function () {
                    return this.LeafLimit * (1 - this.LeafFactor);
                }
            },
            BranchColor: {
                get: function () {
                    return this.IsDead ? "#000" : "#421208";
                }
            },
            EaseDepth: {
                get: function () {
                    return Wischi.LD46.KeepItAlive.BridgeNet.EasingHelper.EaseInQuadOffset;
                }
            },
            EaseThickness: {
                get: function () {
                    return Wischi.LD46.KeepItAlive.BridgeNet.EasingHelper.EaseInQuadOffset;
                }
            },
            EaseDeviation: {
                get: function () {
                    return Wischi.LD46.KeepItAlive.BridgeNet.EasingHelper.EaseLinear;
                }
            }
        },
        ctors: {
            ctor: function (ctx) {
                this.$initialize();
                this.ctx = ctx || (function () {
                    throw new System.ArgumentNullException.$ctor1("ctx");
                })();
            }
        },
        methods: {
            DrawTree: function (treeTrunk) {
                if (treeTrunk == null) {
                    throw new System.ArgumentNullException.$ctor1("treeTrunk");
                }

                this.DrawSegmentInternal(treeTrunk, this.StartX, this.StartY, 1.5707963267948966, Number.NaN);
            },
            DrawSegmentInternal: function (currentSegment, x, y, lastBranchAbsoluteAngle, lastThickness) {
                var $t;
                x = {v:x};
                y = {v:y};
                var floatingDepth = this.DepthLimit * this.EaseDepth(this.GrowthFactor);

                var lowerDepth = Bridge.Int.clip32(floatingDepth);
                var upperDepth = (lowerDepth + 1) | 0;

                if (currentSegment.Depth > upperDepth) {
                    return;
                }

                var depthLengthScale = Math.max(Math.min(1.0, floatingDepth - currentSegment.Depth), 0);

                var effectiveDeviationAngle = currentSegment.DeviationAngle * (this.EaseDeviation(this.GrowthFactor) * 0.3 + 0.7);

                var currentBranchAbsoluteAngle = lastBranchAbsoluteAngle + effectiveDeviationAngle;
                var length = currentSegment.Length * this.GrowthFactor * depthLengthScale;

                var internalThickness = currentSegment.Thickness * this.GrowthFactor * this.EaseThickness(this.GrowthFactor) * depthLengthScale;

                if (internalThickness < this.ThicknessLimit) {
                    return;
                }

                if (internalThickness > this.LeafLimit) {
                    this.ctx.strokeStyle = this.BranchColor;
                    this.ctx.fillStyle = this.BranchColor;
                } else {
                    this.ctx.strokeStyle = "#206411";
                    this.ctx.fillStyle = "#206411";
                }

                if (isNaN(lastThickness)) {
                    lastThickness = internalThickness;
                }
                Bridge.Deconstruct(this.DrawSegmentToCanvas2(x.v, y.v, internalThickness, currentBranchAbsoluteAngle, lastThickness, lastBranchAbsoluteAngle, length).$clone(), x, y);

                $t = Bridge.getEnumerator(currentSegment.Branches, Wischi.LD46.KeepItAlive.TreeSegment);
                try {
                    while ($t.moveNext()) {
                        var branch = $t.Current;
                        this.DrawSegmentInternal(branch, x.v, y.v, currentBranchAbsoluteAngle, internalThickness);
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$Dispose();
                    }
                }
            },
            DrawSegmentToCanvas: function (x, y, thickness, absoluteAngle, previousThickness, previousAngle, length) {
                this.ctx.beginPath();
                this.ctx.moveTo(x, y);

                var dx = Math.cos(absoluteAngle) * length * this.ScaleFactor;
                var dy = Math.sin(absoluteAngle) * length * this.ScaleFactor;

                x += dx;
                y += -dy;

                this.ctx.lineTo(x, y);
                this.ctx.lineWidth = thickness * this.ScaleFactor;
                this.ctx.closePath();

                this.ctx.stroke();

                return new (System.ValueTuple$2(System.Double,System.Double)).$ctor1(x, y);
            },
            DrawSegmentToCanvas2: function (x, y, thickness, absoluteAngle, previousThickness, previousAngle, length) {
                var dx = Math.cos(absoluteAngle) * length * this.ScaleFactor;
                var dy = Math.sin(absoluteAngle) * length * this.ScaleFactor;

                var newX = x + dx;
                var newY = y - dy;

                if (thickness > this.LeafLimit) {
                    var oldNormal = previousAngle - 1.5707963267948966;
                    var oldNormalX = Math.cos(oldNormal) * previousThickness / 2;
                    var oldNormalY = -Math.sin(oldNormal) * previousThickness / 2;

                    var newNormal = absoluteAngle + 1.5707963267948966;
                    var newNormalX = Math.cos(newNormal) * thickness / 2;
                    var newNormalY = -Math.sin(newNormal) * thickness / 2;

                    this.ctx.beginPath();
                    this.ctx.moveTo(x + oldNormalX * this.ScaleFactor, y + oldNormalY * this.ScaleFactor);
                    this.ctx.lineTo(newX - newNormalX * this.ScaleFactor, newY - newNormalY * this.ScaleFactor);
                    this.ctx.lineTo(newX + newNormalX * this.ScaleFactor, newY + newNormalY * this.ScaleFactor);
                    this.ctx.lineTo(x - oldNormalX * this.ScaleFactor, y - oldNormalY * this.ScaleFactor);

                    this.ctx.closePath();

                    this.ctx.fill();

                    this.ctx.beginPath();
                    this.ctx.arc(newX, newY, thickness / 2 * this.ScaleFactor, 0, Wischi.LD46.KeepItAlive.BridgeNet.TreeDrawingContext.TAU);
                    this.ctx.closePath();
                    this.ctx.fill();

                } else {
                    this.ctx.beginPath();

                    this.ctx.moveTo(x, y);
                    this.ctx.lineTo(newX, newY);
                    this.ctx.lineWidth = thickness * this.ScaleFactor;

                    this.ctx.closePath();
                    this.ctx.stroke();
                }

                return new (System.ValueTuple$2(System.Double,System.Double)).$ctor1(newX, newY);
            }
        }
    });

    Bridge.define("Wischi.LD46.KeepItAlive.BridgeNet.TreeEnvironmentConfig", {
        fields: {
            MaxGrowthRate: 0,
            MinWaterRate: 0,
            MaxWaterRate: 0,
            HealRate: 0,
            HarmRate: 0,
            InitialWaterLevel: 0,
            MsRefreshRate: 0,
            MsTickRate: 0,
            MsAutoSave: 0,
            SettingPrefix: null
        },
        ctors: {
            ctor: function (maxGrowthRate, minWaterRate, maxWaterRate, healRate, harmRate, initialWaterLevel, msRefreshRate, msTickRate, msAutoSave, settingPrefix) {
                this.$initialize();
                this.MaxGrowthRate = maxGrowthRate;
                this.MinWaterRate = minWaterRate;
                this.MaxWaterRate = maxWaterRate;
                this.HealRate = healRate;
                this.HarmRate = harmRate;
                this.InitialWaterLevel = initialWaterLevel;
                this.MsRefreshRate = msRefreshRate;
                this.MsTickRate = msTickRate;
                this.MsAutoSave = msAutoSave;
                this.SettingPrefix = settingPrefix;
            }
        }
    });

    Bridge.define("Wischi.LD46.KeepItAlive.BridgeNet.TreeEnvironmentConfigBuilder", {
        fields: {
            FullGrownTree: null,
            TickRate: null,
            WaterMin: null,
            WaterMax: null,
            DurationUntilDeadWhenUnhealthy: null,
            DurationUntilFullHealthWhenHealthy: null,
            ScreenRefreshRate: null,
            InitialWaterLevel: 0,
            SettingPrefix: null
        },
        ctors: {
            init: function () {
                this.FullGrownTree = new System.TimeSpan();
                this.TickRate = new System.TimeSpan();
                this.WaterMin = new System.TimeSpan();
                this.WaterMax = new System.TimeSpan();
                this.DurationUntilDeadWhenUnhealthy = new System.TimeSpan();
                this.DurationUntilFullHealthWhenHealthy = new System.TimeSpan();
                this.ScreenRefreshRate = new System.TimeSpan();
            }
        },
        methods: {
            Build: function () {
                return new Wischi.LD46.KeepItAlive.BridgeNet.TreeEnvironmentConfig(this.GetPerTickValue(this.FullGrownTree), this.GetPerTickValue(this.WaterMin), this.GetPerTickValue(this.WaterMax), this.GetPerTickValue(this.DurationUntilFullHealthWhenHealthy), this.GetPerTickValue(this.DurationUntilDeadWhenUnhealthy), this.InitialWaterLevel, Bridge.Int.clip32(Bridge.Math.round(this.ScreenRefreshRate.getTotalMilliseconds(), 0, 6)), Bridge.Int.clip32(Bridge.Math.round(this.TickRate.getTotalMilliseconds(), 0, 6)), 15000, this.SettingPrefix);
            },
            GetPerTickValue: function (value) {
                return 1.0 / (value.getTotalMilliseconds() / this.TickRate.getTotalMilliseconds());
            }
        }
    });

    Bridge.define("Wischi.LD46.KeepItAlive.BridgeNet.TreeEnvironmentConfigs", {
        statics: {
            fields: {
                Debug: null,
                Release: null,
                NonZensMode: null,
                LudumDare46Test: null
            },
            ctors: {
                init: function () {
                    var $t;
                    this.Debug = ($t = new Wischi.LD46.KeepItAlive.BridgeNet.TreeEnvironmentConfigBuilder(), $t.FullGrownTree = System.TimeSpan.fromMinutes(10), $t.TickRate = System.TimeSpan.fromMilliseconds(10), $t.WaterMax = System.TimeSpan.fromSeconds(160), $t.WaterMin = System.TimeSpan.fromSeconds(50), $t.ScreenRefreshRate = System.TimeSpan.fromMilliseconds(100), $t.DurationUntilDeadWhenUnhealthy = System.TimeSpan.fromSeconds(1000), $t.DurationUntilFullHealthWhenHealthy = System.TimeSpan.fromSeconds(10), $t.InitialWaterLevel = 1, $t.SettingPrefix = "develop", $t).Build();
                    this.Release = ($t = new Wischi.LD46.KeepItAlive.BridgeNet.TreeEnvironmentConfigBuilder(), $t.FullGrownTree = System.TimeSpan.fromDays(730), $t.TickRate = System.TimeSpan.fromMinutes(15), $t.WaterMax = System.TimeSpan.fromDays(16), $t.WaterMin = System.TimeSpan.fromDays(5), $t.ScreenRefreshRate = System.TimeSpan.fromMinutes(1), $t.DurationUntilDeadWhenUnhealthy = System.TimeSpan.fromDays(14), $t.DurationUntilFullHealthWhenHealthy = System.TimeSpan.fromDays(14), $t.InitialWaterLevel = 0.3, $t.SettingPrefix = "bonsai", $t).Build();
                    this.NonZensMode = ($t = new Wischi.LD46.KeepItAlive.BridgeNet.TreeEnvironmentConfigBuilder(), $t.FullGrownTree = System.TimeSpan.fromMinutes(1), $t.TickRate = System.TimeSpan.fromMilliseconds(10), $t.WaterMax = System.TimeSpan.fromSeconds(16), $t.WaterMin = System.TimeSpan.fromSeconds(5), $t.ScreenRefreshRate = System.TimeSpan.fromMilliseconds(100), $t.DurationUntilDeadWhenUnhealthy = System.TimeSpan.fromSeconds(10), $t.DurationUntilFullHealthWhenHealthy = System.TimeSpan.fromSeconds(10), $t.InitialWaterLevel = 1, $t.SettingPrefix = "debug", $t).Build();
                    this.LudumDare46Test = ($t = new Wischi.LD46.KeepItAlive.BridgeNet.TreeEnvironmentConfigBuilder(), $t.FullGrownTree = System.TimeSpan.fromHours(2), $t.TickRate = System.TimeSpan.fromMilliseconds(100), $t.ScreenRefreshRate = System.TimeSpan.fromMilliseconds(1000), $t.WaterMax = System.TimeSpan.fromMinutes(15), $t.WaterMin = System.TimeSpan.fromMinutes(30), $t.DurationUntilDeadWhenUnhealthy = System.TimeSpan.fromMinutes(15), $t.DurationUntilFullHealthWhenHealthy = System.TimeSpan.fromMinutes(15), $t.InitialWaterLevel = 0.3, $t.SettingPrefix = "LD46", $t).Build();
                }
            }
        }
    });

    Bridge.define("Wischi.LD46.KeepItAlive.BridgeNet.TreeState", {
        fields: {
            Seed: 0,
            Health: 0,
            WaterLevel: 0,
            Growth: 0,
            Ticks: System.Int64(0),
            StartTimestamp: 0,
            LastEventTimestamp: 0
        }
    });

    Bridge.define("Wischi.LD46.KeepItAlive.BridgeNet.TreeStateFactory", {
        fields: {
            rng: null,
            clock: null,
            treeEnvironmentConfig: null
        },
        ctors: {
            ctor: function (rng, clock, treeEnvironmentConfig) {
                this.$initialize();
                this.rng = rng || (function () {
                    throw new System.ArgumentNullException.$ctor1("rng");
                })();
                this.clock = clock || (function () {
                    throw new System.ArgumentNullException.$ctor1("clock");
                })();
                this.treeEnvironmentConfig = treeEnvironmentConfig || (function () {
                    throw new System.ArgumentNullException.$ctor1("treeEnvironmentConfig");
                })();
            }
        },
        methods: {
            CreateTree: function () {
                var $t;
                var now = this.clock.Wischi$LD46$KeepItAlive$BridgeNet$IClock$Now();

                return ($t = new Wischi.LD46.KeepItAlive.BridgeNet.TreeState(), $t.Seed = this.rng.Next(), $t.Ticks = System.Int64(0), $t.Growth = 0, $t.Health = 1, $t.StartTimestamp = now, $t.WaterLevel = this.treeEnvironmentConfig.InitialWaterLevel, $t.LastEventTimestamp = now, $t);
            }
        }
    });

    Bridge.define("Wischi.LD46.KeepItAlive.BridgeNet.TreeStateStore", {
        fields: {
            treeStateKey: null,
            tokenKey: null,
            kvs: null
        },
        events: {
            SyncTokenChanged: null
        },
        props: {
            SyncToken: {
                get: function () {
                    return Bridge.as(window.localStorage.getItem(this.tokenKey), System.String);
                },
                set: function (value) {
                    window.localStorage.setItem(this.tokenKey, value);
                    !Bridge.staticEquals(this.SyncTokenChanged, null) ? this.SyncTokenChanged(this, { }) : null;
                }
            }
        },
        ctors: {
            ctor: function (prefix) {
                this.$initialize();
                this.treeStateKey = (prefix || "") + ".TreeStateV1";
                this.tokenKey = (prefix || "") + ".Token";

                this.kvs = new Wischi.LD46.KeepItAlive.BridgeNet.KVS();
            }
        },
        methods: {
            Get: function () {
                var $step = 0,
                    $task1, 
                    $taskResult1, 
                    $jumpFromFinally, 
                    $tcs = new System.Threading.Tasks.TaskCompletionSource(), 
                    $returnValue, 
                    cloudState, 
                    $async_e, 
                    $asyncBody = Bridge.fn.bind(this, function () {
                        try {
                            for (;;) {
                                $step = System.Array.min([0,1], $step);
                                switch ($step) {
                                    case 0: {
                                        $task1 = this.StateFromKvsAsync();
                                        $step = 1;
                                        if ($task1.isCompleted()) {
                                            continue;
                                        }
                                        $task1.continue($asyncBody);
                                        return;
                                    }
                                    case 1: {
                                        $taskResult1 = $task1.getAwaitedResult();
                                        cloudState = $taskResult1;
                                        $tcs.setResult(cloudState || this.LoadFromLocalStorage());
                                        return;
                                    }
                                    default: {
                                        $tcs.setResult(null);
                                        return;
                                    }
                                }
                            }
                        } catch($async_e1) {
                            $async_e = System.Exception.create($async_e1);
                            $tcs.setException($async_e);
                        }
                    }, arguments);

                $asyncBody();
                return $tcs.task;
            },
            Set: function (treeState) {
                var $step = 0,
                    $task1, 
                    $jumpFromFinally, 
                    $tcs = new System.Threading.Tasks.TaskCompletionSource(), 
                    $returnValue, 
                    $async_e, 
                    $asyncBody = Bridge.fn.bind(this, function () {
                        try {
                            for (;;) {
                                $step = System.Array.min([0,1], $step);
                                switch ($step) {
                                    case 0: {
                                        this.SaveToLocalStorage(treeState);
                                        $task1 = this.SaveStateToKvsAsync(treeState);
                                        $step = 1;
                                        if ($task1.isCompleted()) {
                                            continue;
                                        }
                                        $task1.continue($asyncBody);
                                        return;
                                    }
                                    case 1: {
                                        $task1.getAwaitedResult();
                                        $tcs.setResult(null);
                                        return;
                                    }
                                    default: {
                                        $tcs.setResult(null);
                                        return;
                                    }
                                }
                            }
                        } catch($async_e1) {
                            $async_e = System.Exception.create($async_e1);
                            $tcs.setException($async_e);
                        }
                    }, arguments);

                $asyncBody();
                return $tcs.task;
            },
            SaveToLocalStorage: function (treeState) {
                if (treeState == null) {
                    window.localStorage.removeItem(this.treeStateKey);
                    return;
                }

                var treeJson = Newtonsoft.Json.JsonConvert.SerializeObject(treeState);
                window.localStorage.setItem(this.treeStateKey, treeJson);
            },
            LoadFromLocalStorage: function () {
                var treeJson = Bridge.as(window.localStorage.getItem(this.treeStateKey), System.String);

                if (System.String.isNullOrWhiteSpace(treeJson)) {
                    return null;
                }

                return Newtonsoft.Json.JsonConvert.DeserializeObject(treeJson, Wischi.LD46.KeepItAlive.BridgeNet.TreeState);
            },
            StateFromKvsAsync: function () {
                var $step = 0,
                    $task1, 
                    $taskResult1, 
                    $task2, 
                    $taskResult2, 
                    $jumpFromFinally, 
                    $tcs = new System.Threading.Tasks.TaskCompletionSource(), 
                    $returnValue, 
                    resp, 
                    $async_e, 
                    $asyncBody = Bridge.fn.bind(this, function () {
                        try {
                            for (;;) {
                                $step = System.Array.min([0,1,2,3,4], $step);
                                switch ($step) {
                                    case 0: {
                                        $task1 = this.kvs.GetAsync(this.SyncToken);
                                        $step = 1;
                                        if ($task1.isCompleted()) {
                                            continue;
                                        }
                                        $task1.continue($asyncBody);
                                        return;
                                    }
                                    case 1: {
                                        $taskResult1 = $task1.getAwaitedResult();
                                        resp = $taskResult1;

                                        if (resp.StatusCode === 200) {
                                            if (System.String.isNullOrWhiteSpace(resp.Content)) {
                                                $tcs.setResult(null);
                                                return;
                                            }

                                            $tcs.setResult(Newtonsoft.Json.JsonConvert.DeserializeObject(resp.Content, Wischi.LD46.KeepItAlive.BridgeNet.TreeState));
                                            return;
                                        }

                                        if (resp.StatusCode >= 400 && resp.StatusCode <= 499) {
                                            $step = 2;
                                            continue;
                                        } 
                                        $step = 4;
                                        continue;
                                    }
                                    case 2: {
                                        $task2 = this.kvs.NewAsync();
                                        $step = 3;
                                        if ($task2.isCompleted()) {
                                            continue;
                                        }
                                        $task2.continue($asyncBody);
                                        return;
                                    }
                                    case 3: {
                                        $taskResult2 = $task2.getAwaitedResult();
                                        resp = $taskResult2;

                                        if (resp.StatusCode === 200) {
                                            this.SyncToken = resp.Content;
                                            $tcs.setResult(null);
                                            return;
                                        } else {
                                            throw new System.Exception("Failed to get new token");
                                        }
                                        $step = 4;
                                        continue;
                                    }
                                    case 4: {
                                        throw new System.Exception("Failed to get tree state from keystore");
                                        $tcs.setResult(null);
                                        return;
                                    }
                                    default: {
                                        $tcs.setResult(null);
                                        return;
                                    }
                                }
                            }
                        } catch($async_e1) {
                            $async_e = System.Exception.create($async_e1);
                            $tcs.setException($async_e);
                        }
                    }, arguments);

                $asyncBody();
                return $tcs.task;
            },
            SaveStateToKvsAsync: function (state) {
                var $step = 0,
                    $task1, 
                    $taskResult1, 
                    $task2, 
                    $taskResult2, 
                    $task3, 
                    $taskResult3, 
                    $jumpFromFinally, 
                    $tcs = new System.Threading.Tasks.TaskCompletionSource(), 
                    $returnValue, 
                    data, 
                    resp, 
                    $async_e, 
                    $asyncBody = Bridge.fn.bind(this, function () {
                        try {
                            for (;;) {
                                $step = System.Array.min([0,1,2,3,4,5,7], $step);
                                switch ($step) {
                                    case 0: {
                                        data = state == null ? "" : Newtonsoft.Json.JsonConvert.SerializeObject(state);

                                        $task1 = this.kvs.SetAsync(this.SyncToken, data);
                                        $step = 1;
                                        if ($task1.isCompleted()) {
                                            continue;
                                        }
                                        $task1.continue($asyncBody);
                                        return;
                                    }
                                    case 1: {
                                        $taskResult1 = $task1.getAwaitedResult();
                                        resp = $taskResult1;

                                        if (resp.StatusCode !== 200) {
                                            $step = 2;
                                            continue;
                                        } 
                                        $step = 7;
                                        continue;
                                    }
                                    case 2: {
                                        $task2 = this.kvs.NewAsync();
                                        $step = 3;
                                        if ($task2.isCompleted()) {
                                            continue;
                                        }
                                        $task2.continue($asyncBody);
                                        return;
                                    }
                                    case 3: {
                                        $taskResult2 = $task2.getAwaitedResult();
                                        resp = $taskResult2;

                                        if (resp.StatusCode === 200) {
                                            $step = 4;
                                            continue;
                                        } 
                                        $step = 6;
                                        continue;
                                    }
                                    case 4: {
                                        $task3 = this.kvs.SetAsync(this.SyncToken, data);
                                        $step = 5;
                                        if ($task3.isCompleted()) {
                                            continue;
                                        }
                                        $task3.continue($asyncBody);
                                        return;
                                    }
                                    case 5: {
                                        $taskResult3 = $task3.getAwaitedResult();
                                        $step = 6;
                                        continue;
                                    }

                                    case 7: {
                                        $tcs.setResult(null);
                                        return;
                                    }
                                    default: {
                                        $tcs.setResult(null);
                                        return;
                                    }
                                }
                            }
                        } catch($async_e1) {
                            $async_e = System.Exception.create($async_e1);
                            $tcs.setException($async_e);
                        }
                    }, arguments);

                $asyncBody();
                return $tcs.task;
            }
        }
    });

    Bridge.define("Wischi.LD46.KeepItAlive.IRandomSource", {
        $kind: "interface"
    });

    Bridge.define("Wischi.LD46.KeepItAlive.RandomExtensions", {
        statics: {
            methods: {
                UniformRandom: function (randomSource, lowerLimit, upperLimit) {
                    var delta = (upperLimit - lowerLimit);
                    var randAmount = randomSource.Wischi$LD46$KeepItAlive$IRandomSource$NextDouble() * delta;
                    return lowerLimit + randAmount;
                }
            }
        }
    });

    Bridge.define("Wischi.LD46.KeepItAlive.TreeBuilder", {
        statics: {
            fields: {
                TAU: 0
            },
            ctors: {
                init: function () {
                    this.TAU = 6.2831853071795862;
                }
            }
        },
        fields: {
            random: null,
            TrunkThickness: 0,
            ProbabilitySingleBranch: 0,
            BranchThicknessReductionFactor: 0,
            BranchLengthReductionFactorMin: 0,
            BranchLengthReductionFactorMax: 0,
            MaxRotationFactor: 0,
            BranchSpreadMin: 0,
            BranchSpreadMax: 0,
            MaxDepth: 0
        },
        ctors: {
            init: function () {
                this.TrunkThickness = 0.3;
                this.ProbabilitySingleBranch = 0.1;
                this.BranchThicknessReductionFactor = 0.7;
                this.BranchLengthReductionFactorMin = 0.6;
                this.BranchLengthReductionFactorMax = 0.85;
                this.MaxRotationFactor = 0.31415926535897931;
                this.BranchSpreadMin = 0.62831853071795862;
                this.BranchSpreadMax = 1.2566370614359173;
                this.MaxDepth = 12;
            },
            ctor: function (random) {
                this.$initialize();
                this.random = random || (function () {
                    throw new System.ArgumentNullException.$ctor1("random");
                })();
            }
        },
        methods: {
            BuildTree: function () {
                var trunk = new Wischi.LD46.KeepItAlive.TreeSegment.ctor(this.TrunkThickness);
                this.AddBranchesToSegment(trunk, 1.5707963267948966);
                return trunk;
            },
            AddBranchesToSegment: function (segment, absoluteAngle) {
                if (segment.Depth === this.MaxDepth) {
                    return;
                }

                if (segment.Thickness < 0.002) {
                    return;
                }

                var maxDevAngle = 0.62831853071795862;
                var gravityNormal = 4.71238898038469;

                var deltaAngle = Math.atan2(Math.sin(gravityNormal - absoluteAngle), Math.cos(gravityNormal - absoluteAngle));

                if (Math.abs(deltaAngle) < maxDevAngle) {
                    return;
                }

                var randomDeviationAngle = this.random.Wischi$LD46$KeepItAlive$IRandomSource$NextDouble() * 2 * this.MaxRotationFactor - this.MaxRotationFactor;
                var deviationAngle = this.BiasedValue(0, randomDeviationAngle, 1);

                var branchingSpread = Wischi.LD46.KeepItAlive.RandomExtensions.UniformRandom(this.random, this.BranchSpreadMin, this.BranchSpreadMax);

                if (segment.Depth === 0) {
                    this.AddAngledBranch(segment, deviationAngle - branchingSpread / 2, absoluteAngle);
                    this.AddAngledBranch(segment, deviationAngle + branchingSpread / 2, absoluteAngle);
                    this.AddAngledBranch(segment, deviationAngle, absoluteAngle);
                } else if (this.random.Wischi$LD46$KeepItAlive$IRandomSource$NextDouble() <= this.ProbabilitySingleBranch) {
                    this.AddAngledBranch(segment, deviationAngle, absoluteAngle);
                } else {
                    var leftAngle = deviationAngle - branchingSpread / 2;
                    var rightAngle = deviationAngle + branchingSpread / 2;

                    if (this.random.Wischi$LD46$KeepItAlive$IRandomSource$NextDouble() < 0.8) {
                        var rndAngle = Wischi.LD46.KeepItAlive.RandomExtensions.UniformRandom(this.random, deviationAngle - branchingSpread, deviationAngle + branchingSpread);
                        var thickness = Wischi.LD46.KeepItAlive.RandomExtensions.UniformRandom(this.random, 0.25, 0.5);
                        this.AddAngledBranch(segment, rndAngle, absoluteAngle, thickness);
                    }

                    this.AddAngledBranch(segment, leftAngle, absoluteAngle);
                    this.AddAngledBranch(segment, rightAngle, absoluteAngle);
                }
            },
            BiasedValue: function (valueA, valueB, bias) {
                return valueB * bias + valueA * (1 - bias);
            },
            AddAngledBranch: function (parent, deviation, oldAbsoluteAngle, extraThicknessFactor) {
                if (extraThicknessFactor === void 0) { extraThicknessFactor = 1.0; }
                var lengthFactor = 0.8;

                if (parent.Depth < 3) {
                    lengthFactor = Wischi.LD46.KeepItAlive.RandomExtensions.UniformRandom(this.random, this.BranchLengthReductionFactorMin, this.BranchLengthReductionFactorMax);
                }

                var nextThinckness = parent.Thickness * this.BranchThicknessReductionFactor * extraThicknessFactor;

                var branch = parent.AddBranch(deviation, parent.Length * lengthFactor, nextThinckness);
                this.AddBranchesToSegment(branch, oldAbsoluteAngle + deviation);
            }
        }
    });

    Bridge.define("Wischi.LD46.KeepItAlive.TreeSegment", {
        fields: {
            Depth: 0,
            Thickness: 0,
            DeviationAngle: 0,
            Length: 0,
            Branches: null
        },
        ctors: {
            ctor: function (thickness) {
                this.$initialize();
                this.Depth = 0;
                this.DeviationAngle = 0;
                this.Length = 1;

                this.Branches = new (System.Collections.Generic.List$1(Wischi.LD46.KeepItAlive.TreeSegment)).ctor();
                this.Thickness = thickness;
            },
            $ctor1: function (depth, deviationAngle, length, thickness) {
                this.$initialize();
                this.Depth = depth;
                this.DeviationAngle = deviationAngle;
                this.Length = length;
                this.Thickness = thickness;
                this.Branches = new (System.Collections.Generic.List$1(Wischi.LD46.KeepItAlive.TreeSegment)).ctor();
            }
        },
        methods: {
            AddBranch: function (deviationAngle, length, thickness) {
                var branch = new Wischi.LD46.KeepItAlive.TreeSegment.$ctor1(((this.Depth + 1) | 0), deviationAngle, length, thickness);
                System.Array.add(this.Branches, branch, Wischi.LD46.KeepItAlive.TreeSegment);
                return branch;
            }
        }
    });

    Bridge.define("Wischi.LD46.KeepItAlive.Vector2D", {
        $kind: "struct",
        statics: {
            methods: {
                getDefaultValue: function () { return new Wischi.LD46.KeepItAlive.Vector2D(); }
            }
        },
        fields: {
            X: 0,
            Y: 0
        },
        props: {
            Length: {
                get: function () {
                    return Math.sqrt(this.X * this.X + this.Y * this.Y);
                }
            }
        },
        ctors: {
            $ctor1: function (x, y) {
                this.$initialize();
                this.X = x;
                this.Y = y;
            },
            ctor: function () {
                this.$initialize();
            }
        },
        methods: {
            Rotate: function (radianAngle) {
                var cosAngle = Math.cos(radianAngle);
                var sinAngle = Math.sin(radianAngle);

                var x = cosAngle * this.X - sinAngle * this.Y;
                var y = sinAngle * this.X + cosAngle * this.Y;

                return new Wischi.LD46.KeepItAlive.Vector2D.$ctor1(x, y);
            },
            ChangeLength: function (newLength) {
                var len = this.Length;

                var normalizedX = this.X / len;
                var normalizedY = this.Y / len;

                return new Wischi.LD46.KeepItAlive.Vector2D.$ctor1(normalizedX * newLength, normalizedY * newLength);
            },
            getHashCode: function () {
                var h = Bridge.addHash([3096827845, this.X, this.Y]);
                return h;
            },
            equals: function (o) {
                if (!Bridge.is(o, Wischi.LD46.KeepItAlive.Vector2D)) {
                    return false;
                }
                return Bridge.equals(this.X, o.X) && Bridge.equals(this.Y, o.Y);
            },
            $clone: function (to) { return this; }
        }
    });

    Bridge.define("Wischi.LD46.KeepItAlive.BridgeNet.BridgeClock", {
        inherits: [Wischi.LD46.KeepItAlive.BridgeNet.IClock],
        alias: ["Now", "Wischi$LD46$KeepItAlive$BridgeNet$IClock$Now"],
        methods: {
            Now: function () {
                return Date.now();
            }
        }
    });

    /** @namespace Wischi.LD46.KeepItAlive.BridgeNet */

    /**
     * This storage is legacy (since 22.02.2020) and will be removed later.
     *
     * @public
     * @class Wischi.LD46.KeepItAlive.BridgeNet.LocalStorageLegacyTreeStateStore
     * @implements  Wischi.LD46.KeepItAlive.BridgeNet.ITreeStateStore
     */
    Bridge.define("Wischi.LD46.KeepItAlive.BridgeNet.LocalStorageLegacyTreeStateStore", {
        inherits: [Wischi.LD46.KeepItAlive.BridgeNet.ITreeStateStore],
        fields: {
            seedKey: null,
            tickKey: null,
            startKey: null,
            growthKey: null,
            healthKey: null,
            lastUpdateKey: null,
            waterLevelKey: null
        },
        alias: [
            "Get", "Wischi$LD46$KeepItAlive$BridgeNet$ITreeStateStore$Get",
            "Set", "Wischi$LD46$KeepItAlive$BridgeNet$ITreeStateStore$Set"
        ],
        ctors: {
            ctor: function (prefix) {
                this.$initialize();
                this.seedKey = (prefix || "") + ".Seed";
                this.tickKey = (prefix || "") + ".Ticks";
                this.startKey = (prefix || "") + ".Start";
                this.growthKey = (prefix || "") + ".Growth";
                this.healthKey = (prefix || "") + ".Health";
                this.lastUpdateKey = (prefix || "") + ".LastUpdate";
                this.waterLevelKey = (prefix || "") + ".WaterLevel";
            }
        },
        methods: {
            Get: function () {
                var $t;
                var seedValue = Bridge.as(window.localStorage.getItem(this.seedKey), System.String);
                var tickValue = Bridge.as(window.localStorage.getItem(this.tickKey), System.String);
                var startValue = Bridge.as(window.localStorage.getItem(this.startKey), System.String);
                var growthValue = Bridge.as(window.localStorage.getItem(this.growthKey), System.String);
                var healthValue = Bridge.as(window.localStorage.getItem(this.healthKey), System.String);
                var waterLevelValue = Bridge.as(window.localStorage.getItem(this.waterLevelKey), System.String);
                var lastUpdateValue = Bridge.as(window.localStorage.getItem(this.lastUpdateKey), System.String);
                var seed = { };
                var tick = { };
                var start = { };
                var growth = { };
                var health = { };
                var lastUpdate = { };
                var waterLevel = { };


                var parseSuccess = !!(!!(!!(!!(!!(!!(System.Int32.tryParse(seedValue, seed) & System.Int32.tryParse(tickValue, tick)) & System.Double.tryParse(startValue, null, start)) & System.Double.tryParse(growthValue, null, growth)) & System.Double.tryParse(healthValue, null, health)) & System.Double.tryParse(lastUpdateValue, null, lastUpdate)) & System.Double.tryParse(waterLevelValue, null, waterLevel));

                if (!parseSuccess) {
                    return null;
                }

                return ($t = new Wischi.LD46.KeepItAlive.BridgeNet.TreeState(), $t.Seed = seed.v, $t.Ticks = System.Int64(tick.v), $t.Growth = growth.v, $t.Health = health.v, $t.StartTimestamp = start.v, $t.WaterLevel = waterLevel.v, $t.LastEventTimestamp = lastUpdate.v, $t);
            },
            Set: function (treeState) {
                window.localStorage.setItem(this.seedKey, treeState.Seed);
                window.localStorage.setItem(this.tickKey, treeState.Ticks);
                window.localStorage.setItem(this.healthKey, treeState.Health);
                window.localStorage.setItem(this.growthKey, treeState.Growth);
                window.localStorage.setItem(this.startKey, treeState.StartTimestamp);
                window.localStorage.setItem(this.waterLevelKey, treeState.WaterLevel);
                window.localStorage.setItem(this.lastUpdateKey, treeState.LastEventTimestamp);
            },
            RemoveLegacy: function () {
                window.localStorage.removeItem(this.seedKey);
                window.localStorage.removeItem(this.tickKey);
                window.localStorage.removeItem(this.healthKey);
                window.localStorage.removeItem(this.growthKey);
                window.localStorage.removeItem(this.startKey);
                window.localStorage.removeItem(this.waterLevelKey);
                window.localStorage.removeItem(this.lastUpdateKey);
            }
        }
    });

    Bridge.define("Wischi.LD46.KeepItAlive.RandomWrapper", {
        inherits: [Wischi.LD46.KeepItAlive.IRandomSource],
        fields: {
            random: null,
            seed: 0
        },
        alias: ["NextDouble", "Wischi$LD46$KeepItAlive$IRandomSource$NextDouble"],
        ctors: {
            ctor: function (seed) {
                this.$initialize();
                this.seed = seed;
                this.Reset();
            }
        },
        methods: {
            Reset: function () {
                this.random = new System.Random.$ctor1(this.seed);
            },
            NextDouble: function () {
                return this.random.NextDouble();
            }
        }
    });
});

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICJXaXNjaGkuTEQ0Ni5LZWVwSXRBbGl2ZS5CcmlkZ2VOZXQuanMiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbIkJvb3RzdHJhcC5jcyIsIkVhc2luZ0hlbHBlci5jcyIsIlRyZWVTdGF0ZVN0b3JlLmNzIiwiVHJlZURyYXdlci5jcyIsIlRhc2tYLmNzIiwiVHJlZUFwcENvbnRleHQuY3MiLCIuLi9XaXNjaGkuTEQ0Ni5LZWVwSXRBbGl2ZS5TaGFyZWQvVHJlZUJlaGF2aW91ckVuZ2luZS5jcyIsIlRyZWVEcmF3aW5nQ29udGV4dC5jcyIsIi4uL1dpc2NoaS5MRDQ2LktlZXBJdEFsaXZlLlNoYXJlZC9UcmVlRW52aXJvbm1lbnRDb25maWcuY3MiLCIuLi9XaXNjaGkuTEQ0Ni5LZWVwSXRBbGl2ZS5TaGFyZWQvVHJlZUNvbmZpZ3VyYXRpb25CdWlsZGVyLmNzIiwiLi4vV2lzY2hpLkxENDYuS2VlcEl0QWxpdmUuU2hhcmVkL1RyZWVDb25maWd1cmF0aW9ucy5jcyIsIi4uL1dpc2NoaS5MRDQ2LktlZXBJdEFsaXZlLlNoYXJlZC9UcmVlU3RhdGVGYWN0b3J5LmNzIiwiLi4vV2lzY2hpLkxENDYuS2VlcEl0QWxpdmUuU2hhcmVkL1JhbmRvbUV4dGVuc2lvbnMuY3MiLCIuLi9XaXNjaGkuTEQ0Ni5LZWVwSXRBbGl2ZS5TaGFyZWQvVHJlZUJ1aWxkZXIuY3MiLCIuLi9XaXNjaGkuTEQ0Ni5LZWVwSXRBbGl2ZS5TaGFyZWQvVHJlZVNlZ21lbnQuY3MiLCIuLi9XaXNjaGkuTEQ0Ni5LZWVwSXRBbGl2ZS5TaGFyZWQvVmVjdG9yMkQuY3MiLCJCcmlkZ2VDbG9jay5jcyIsIkxvY2FsU3RvcmFnZUxlZ2FjeVRyZWVTdGF0ZVN0b3JlLmNzIiwiLi4vV2lzY2hpLkxENDYuS2VlcEl0QWxpdmUuU2hhcmVkL1JhbmRvbVdyYXBwZXIuY3MiXSwKICAibmFtZXMiOiBbIiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O29CQWtC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QUFrQkEsc0NBQTRCQTtnQkFDOUNBLGtCQUFrQkEsc0NBQTRCQTtnQkFDOUNBLHNCQUFzQkEsc0NBQTRCQTtnQkFDbERBLHNCQUFzQkEsc0NBQTRCQTtnQkFDOURBO2dCQUNBQTtnQkFDQUE7Z0JBQ0FBO2dCQUNBQTtnQkFDQUE7Z0JBQ0FBOzs7Z0JBS1lBLG1CQUNJQSx3Q0FBYUEsV0FBZUEsUUFDNUJBLHNCQUFhQSxXQUFlQSxTQUM1QkEsdUJBQWdCQSxrQkFBZ0JBLFVBQ2hDQSx1QkFBZ0JBLG1CQUFpQkEsV0FDakNBLHVCQUFnQkEsbUJBQWlCQSxXQUNqQ0EsdUJBQWdCQSx1QkFBcUJBLGVBQ3JDQSx1QkFBZ0JBLHVCQUFxQkE7O2dCQUV6Q0EsSUFBSUEsQ0FBQ0E7b0JBRURBLE9BQU9BOzs7Z0JBR1hBLE9BQU9BLFVBQUlBLHlEQUVBQSxtQkFDQ0Esa0NBQ0NBLHNCQUNBQSw4QkFDUUEseUJBQ0pBLHNDQUNRQTs7MkJBSWJBO2dCQUVaQSw0QkFBNEJBLGNBQVNBO2dCQUNyQ0EsNEJBQTRCQSxjQUFTQTtnQkFDckNBLDRCQUE0QkEsZ0JBQVdBO2dCQUN2Q0EsNEJBQTRCQSxnQkFBV0E7Z0JBQ3ZDQSw0QkFBNEJBLGVBQVVBO2dCQUN0Q0EsNEJBQTRCQSxvQkFBZUE7Z0JBQzNDQSw0QkFBNEJBLG9CQUFlQTs7O2dCQUszQ0EsK0JBQStCQTtnQkFDL0JBLCtCQUErQkE7Z0JBQy9CQSwrQkFBK0JBO2dCQUMvQkEsK0JBQStCQTtnQkFDL0JBLCtCQUErQkE7Z0JBQy9CQSwrQkFBK0JBO2dCQUMvQkEsK0JBQStCQTs7Ozs7Ozs7Ozs7Ozs0QkNyRmRBOztnQkFFakJBLFlBQVlBO2dCQUNaQTs7Ozs7Z0JBS0FBLGNBQVNBLElBQUlBLHFCQUFPQTs7O2dCQUtwQkEsT0FBT0EiLAogICJzb3VyY2VzQ29udGVudCI6IFsidXNpbmcgQnJpZGdlO1xyXG51c2luZyBCcmlkZ2UuSHRtbDU7XHJcbnVzaW5nIFN5c3RlbTtcclxudXNpbmcgU3lzdGVtLlRocmVhZGluZy5UYXNrcztcclxuXHJcbm5hbWVzcGFjZSBXaXNjaGkuTEQ0Ni5LZWVwSXRBbGl2ZS5CcmlkZ2VOZXRcclxue1xyXG4gICAgcHVibGljIHN0YXRpYyBjbGFzcyBCb290c3RyYXBcclxuICAgIHtcclxuICAgICAgICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBSYW5kb20gcm5nO1xyXG4gICAgICAgIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IEJyaWRnZUNsb2NrIGNsb2NrO1xyXG4gICAgICAgIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IFRyZWVFbnZpcm9ubWVudENvbmZpZyBjb25maWc7XHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgVHJlZVN0YXRlRmFjdG9yeSB0cmVlU3RhdGVGYWN0b3J5O1xyXG4gICAgICAgIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IFRyZWVTdGF0ZVN0b3JlIHRyZWVTdGF0ZVN0b3JlO1xyXG4gICAgICAgIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IFNoYXJlZERyYXdpbmdTdGF0ZSBzaGFyZWREcmF3aW5nU3RhdGU7XHJcblxyXG4gICAgICAgIHN0YXRpYyBCb290c3RyYXAoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcm5nID0gbmV3IFJhbmRvbSgpO1xyXG4gICAgICAgICAgICBjbG9jayA9IG5ldyBCcmlkZ2VDbG9jaygpO1xyXG4gICAgICAgICAgICBjb25maWcgPSBUcmVlRW52aXJvbm1lbnRDb25maWdzLlJlbGVhc2U7XHJcbiAgICAgICAgICAgIHNoYXJlZERyYXdpbmdTdGF0ZSA9IG5ldyBTaGFyZWREcmF3aW5nU3RhdGUoKTtcclxuXHJcbiAgICAgICAgICAgIHRyZWVTdGF0ZUZhY3RvcnkgPSBuZXcgVHJlZVN0YXRlRmFjdG9yeShybmcsIGNsb2NrLCBjb25maWcpO1xyXG4gICAgICAgICAgICB0cmVlU3RhdGVTdG9yZSA9IG5ldyBUcmVlU3RhdGVTdG9yZShjb25maWcuU2V0dGluZ1ByZWZpeCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHN0YXRpYyBUYXNrPEhUTUxJbWFnZUVsZW1lbnQ+IExvYWRJbWFnZUFzeW5jKHN0cmluZyBzcmMpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgaW1hZ2VFbGVtZW50ID0gbmV3IEhUTUxJbWFnZUVsZW1lbnQoKTtcclxuICAgICAgICAgICAgdmFyIGNvbXBsZXRpb25Tb3VyY2UgPSBuZXcgVGFza0NvbXBsZXRpb25Tb3VyY2U8SFRNTEltYWdlRWxlbWVudD4oKTtcclxuICAgICAgICAgICAgaW1hZ2VFbGVtZW50LlNyYyA9IHNyYztcclxuXHJcbiAgICAgICAgICAgIGltYWdlRWxlbWVudC5BZGRFdmVudExpc3RlbmVyKEV2ZW50VHlwZS5Mb2FkLCAoQWN0aW9uKSgoKSA9PlxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjb21wbGV0aW9uU291cmNlLlNldFJlc3VsdChpbWFnZUVsZW1lbnQpO1xyXG4gICAgICAgICAgICB9KSk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gY29tcGxldGlvblNvdXJjZS5UYXNrO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgYXN5bmMgVGFzayBNaWdyYXRlU2V0dGluZ3NBc3luYygpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgbGVnYWN5U3RhdGVTdG9yZSA9IG5ldyBMb2NhbFN0b3JhZ2VMZWdhY3lUcmVlU3RhdGVTdG9yZShjb25maWcuU2V0dGluZ1ByZWZpeCk7XHJcblxyXG4gICAgICAgICAgICB2YXIgc3RhdGUgPSBsZWdhY3lTdGF0ZVN0b3JlLkdldCgpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHN0YXRlICE9IG51bGwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIC8vIG1pZ3JhdGUgdG8gbmV3IHN0b3JlXHJcbiAgICAgICAgICAgICAgICBhd2FpdCB0cmVlU3RhdGVTdG9yZS5TZXQoc3RhdGUpO1xyXG4gICAgICAgICAgICAgICAgbGVnYWN5U3RhdGVTdG9yZS5SZW1vdmVMZWdhY3koKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgdm9pZCBTZXRIYXNoQXNTeW5jVG9rZW4oKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIGhzID0gV2luZG93LkxvY2F0aW9uLkhhc2g7XHJcblxyXG4gICAgICAgICAgICBpZiAoaHMuU3RhcnRzV2l0aChcIiNcIikpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGhzID0gaHMuU3Vic3RyaW5nKDEpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoIXN0cmluZy5Jc051bGxPcldoaXRlU3BhY2UoaHMpKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0cmVlU3RhdGVTdG9yZS5TeW5jVG9rZW4gPSBocztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFdpbmRvdy5Mb2NhdGlvbi5IYXNoID0gXCIjXCIgKyB0cmVlU3RhdGVTdG9yZS5TeW5jVG9rZW47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIFtSZWFkeV1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGFzeW5jIFRhc2sgTWFpbkFzeW5jKClcclxuICAgICAgICB7XHJcblN5c3RlbS5BY3Rpb24gVXBkYXRlU3RhdGVBbmREcmF3ID0gbnVsbDtcblN5c3RlbS5BY3Rpb24gRHJhdyA9IG51bGw7XG5IVE1MQ2FudmFzRWxlbWVudCBjYW52YXM7ICAgICAgICAgICAgaWYgKCEoKGNhbnZhcyA9IERvY3VtZW50LkdldEVsZW1lbnRCeUlkKFwiY2FudmFzXCIpIGFzIEhUTUxDYW52YXNFbGVtZW50KSAhPSBudWxsKSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgQ29uc29sZS5Xcml0ZShcIkNhbnZhcyBub3QgZm91bmQuIEV4aXRpbmcuXCIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YXIgbG9hZGVyID0gbmV3IExvYWRpbmdEcmF3ZXIoY2FudmFzKTtcclxuICAgICAgICAgICAgbG9hZGVyLkRyYXcoKTtcclxuXHJcbiAgICAgICAgICAgIGF3YWl0IE1pZ3JhdGVTZXR0aW5nc0FzeW5jKCk7XHJcblxyXG4gICAgICAgICAgICBTZXRIYXNoQXNTeW5jVG9rZW4oKTtcclxuXHJcbiAgICAgICAgICAgIHRyZWVTdGF0ZVN0b3JlLlN5bmNUb2tlbkNoYW5nZWQgKz0gKHMsIGUpID0+XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFdpbmRvdy5Mb2NhdGlvbi5IYXNoID0gXCIjXCIgKyB0cmVlU3RhdGVTdG9yZS5TeW5jVG9rZW47XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICB2YXIgY29udGV4dCA9IG5ldyBUcmVlQXBwQ29udGV4dChcclxuICAgICAgICAgICAgICAgIGNsb2NrLFxyXG4gICAgICAgICAgICAgICAgY29uZmlnLFxyXG4gICAgICAgICAgICAgICAgdHJlZVN0YXRlU3RvcmUsXHJcbiAgICAgICAgICAgICAgICB0cmVlU3RhdGVGYWN0b3J5LFxyXG4gICAgICAgICAgICAgICAgc2hhcmVkRHJhd2luZ1N0YXRlXHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICBhd2FpdCBjb250ZXh0LkluaXRpYWxpemVBc3luYygpO1xyXG4gICAgICAgICAgICBjb250ZXh0LlVwZGF0ZUdhbWVTdGF0ZSgpO1xyXG5cclxuICAgICAgICAgICAgdmFyIHdhdGVyVGFzayA9IExvYWRJbWFnZUFzeW5jKFwiaW1nL3dhdGVyLnBuZ1wiKTtcclxuICAgICAgICAgICAgdmFyIHJlc2V0VGFzayA9IExvYWRJbWFnZUFzeW5jKFwiaW1nL3Jlc2V0LnBuZ1wiKTtcclxuICAgICAgICAgICAgdmFyIGF1dG9TYXZlVGFzayA9IGNvbnRleHQuQXV0b1NhdmUoKTtcclxuXHJcbiAgICAgICAgICAgIGF3YWl0IFRhc2suV2hlbkFsbCh3YXRlclRhc2ssIHJlc2V0VGFzaywgYXV0b1NhdmVUYXNrKTtcclxuXHJcbiAgICAgICAgICAgIHZhciB3YXRlciA9IHdhdGVyVGFzay5SZXN1bHQ7XHJcbiAgICAgICAgICAgIHZhciByZXNldCA9IHJlc2V0VGFzay5SZXN1bHQ7XHJcbkhUTUxJbnB1dEVsZW1lbnQgc2xpZGVyO1xyXG4gICAgICAgICAgICBpZiAoKHNsaWRlciA9IERvY3VtZW50LkdldEVsZW1lbnRCeUlkKFwic2xpZGVyXCIpIGFzIEhUTUxJbnB1dEVsZW1lbnQpICE9IG51bGwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHNsaWRlci5BZGRFdmVudExpc3RlbmVyKEV2ZW50VHlwZS5JbnB1dCwgKEFjdGlvbikoKCkgPT5cclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZmFjdG9yID0gaW50LlBhcnNlKHNsaWRlci5WYWx1ZSkgLyAxMDAuMDtcclxuICAgICAgICAgICAgICAgICAgICBjb250ZXh0LlRyZWVCZWhhdmlvdXIuVHJlZVN0YXRlLkdyb3d0aCA9IGZhY3RvcjtcclxuICAgICAgICAgICAgICAgIH0pKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyIGRyYXdlciA9IG5ldyBUcmVlRHJhd2VyKGNhbnZhcywgd2F0ZXIsIHJlc2V0LCBzaGFyZWREcmF3aW5nU3RhdGUpO1xyXG5EcmF3ID0gKCkgPT5cclxue1xyXG4gICAgY29udGV4dC5VcGRhdGVQcmVSZW5kZXIoKTtcclxuICAgIGRyYXdlci5EcmF3KCk7XHJcbn1cclxuXHJcbjtcblVwZGF0ZVN0YXRlQW5kRHJhdyA9ICgpID0+XHJcbntcclxuICAgIGNvbnRleHQuVXBkYXRlR2FtZVN0YXRlKCk7XHJcbiAgICBEcmF3KCk7XHJcbn1cclxuXHJcbjtcblxyXG4gICAgICAgICAgICBXaW5kb3cuT25IYXNoQ2hhbmdlID0gYXN5bmMgKF8pID0+XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFNldEhhc2hBc1N5bmNUb2tlbigpO1xyXG4gICAgICAgICAgICAgICAgYXdhaXQgY29udGV4dC5Jbml0aWFsaXplQXN5bmMoKTtcclxuICAgICAgICAgICAgICAgIFVwZGF0ZVN0YXRlQW5kRHJhdygpO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgXHJcblxyXG4gICAgICAgICAgICBcclxuXHJcbiAgICAgICAgICAgIHdhdGVyLkFkZEV2ZW50TGlzdGVuZXIoRXZlbnRUeXBlLkxvYWQsIChBY3Rpb24pVXBkYXRlU3RhdGVBbmREcmF3KTtcclxuXHJcbiAgICAgICAgICAgIGNhbnZhcy5BZGRFdmVudExpc3RlbmVyKEV2ZW50VHlwZS5DbGljaywgKEFjdGlvbjxFdmVudD4pKGFzeW5jIChlKSA9PlxyXG4gICAgICAgICAgICB7XHJcbk1vdXNlRXZlbnQgbWU7ICAgICAgICAgICAgICAgIGlmICghKChtZSA9IGUgYXMgTW91c2VFdmVudCkgIT0gbnVsbCkpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIFNjcmlwdC5Xcml0ZShcInZhciByZWN0ID0gZS50YXJnZXQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XCIpO1xyXG4gICAgICAgICAgICAgICAgU2NyaXB0LldyaXRlKFwidmFyIHggPSBNYXRoLmZsb29yKGUuY2xpZW50WCAtIHJlY3QubGVmdCk7XCIpO1xyXG4gICAgICAgICAgICAgICAgU2NyaXB0LldyaXRlKFwidmFyIHkgPSBNYXRoLmZsb29yKGUuY2xpZW50WSAtIHJlY3QudG9wKTtcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIHh4ID0gU2NyaXB0LkdldDxpbnQ+KFwieFwiKTtcclxuICAgICAgICAgICAgICAgIHZhciB5eSA9IFNjcmlwdC5HZXQ8aW50PihcInlcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gSGl0LVRlc3QgZm9yIFwiYnV0dG9uXCJcclxuICAgICAgICAgICAgICAgIGlmICh4eCA8PSA4MCAmJiB5eSA+PSA0MzApXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbnRleHQuVHJlZUJlaGF2aW91ci5UcmVlU3RhdGUuSGVhbHRoID09IDApXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBSZXNldCBUcmVlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IGNvbnRleHQuUmVzZXRUcmVlQXN5bmMoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgY29udGV4dC5XYXRlckFzeW5jKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBVcGRhdGVTdGF0ZUFuZERyYXcoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSkpO1xyXG5cclxuICAgICAgICAgICAgV2luZG93LlNldEludGVydmFsKChBY3Rpb24pRHJhdywgY29uZmlnLk1zUmVmcmVzaFJhdGUpO1xyXG4gICAgICAgICAgICBXaW5kb3cuU2V0SW50ZXJ2YWwoKEFjdGlvbiljb250ZXh0LlVwZGF0ZUdhbWVTdGF0ZSwgY29uZmlnLk1zVGlja1JhdGUpO1xyXG4gICAgICAgICAgICBXaW5kb3cuU2V0SW50ZXJ2YWwoKCkgPT4gQnJpZGdlLlNjcmlwdC5EaXNjYXJkPSBjb250ZXh0LkF1dG9TYXZlKCksIGNvbmZpZy5Nc0F1dG9TYXZlKTtcclxuXHJcbiAgICAgICAgICAgIFVwZGF0ZVN0YXRlQW5kRHJhdygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcblxyXG5uYW1lc3BhY2UgV2lzY2hpLkxENDYuS2VlcEl0QWxpdmUuQnJpZGdlTmV0XHJcbntcclxuICAgIHB1YmxpYyBzdGF0aWMgY2xhc3MgRWFzaW5nSGVscGVyXHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBkb3VibGUgRWFzZU91dFNpbmUoZG91YmxlIHgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gTWF0aC5TaW4oeCAqIE1hdGguUEkgLyAyKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZG91YmxlIEVhc2VPdXRRdWFkKGRvdWJsZSB4KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuIDEgLSAoMSAtIHgpICogKDEgLSB4KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZG91YmxlIEVhc2VPdXRRdWludChkb3VibGUgeClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJldHVybiAxIC0gTWF0aC5Qb3coMSAtIHgsIDUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBkb3VibGUgRWFzZUluUXVhZChkb3VibGUgeClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJldHVybiB4ICogeCAqIHggKiB4O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBkb3VibGUgRWFzZUluUXVhZE9mZnNldChkb3VibGUgeClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHggPSB4ICogMC41ICsgMC41O1xyXG4gICAgICAgICAgICByZXR1cm4geCAqIHggKiB4ICogeDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZG91YmxlIEVhc2VMaW5lYXIoZG91YmxlIHgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4geDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZG91YmxlIEVhc2VJbkV4cChkb3VibGUgZmFjdG9yKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKGZhY3RvciA8PSAwKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIE1hdGguUG93KDIsIDEwICogZmFjdG9yIC0gMTApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBCcmlkZ2UuSHRtbDU7XHJcbnVzaW5nIE5ld3RvbnNvZnQuSnNvbjtcclxudXNpbmcgU3lzdGVtO1xyXG51c2luZyBTeXN0ZW0uVGhyZWFkaW5nLlRhc2tzO1xyXG5cclxubmFtZXNwYWNlIFdpc2NoaS5MRDQ2LktlZXBJdEFsaXZlLkJyaWRnZU5ldFxyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgVHJlZVN0YXRlU3RvcmVcclxuICAgIHtcclxuICAgICAgICBwcml2YXRlIHJlYWRvbmx5IHN0cmluZyB0cmVlU3RhdGVLZXk7XHJcbiAgICAgICAgcHJpdmF0ZSByZWFkb25seSBzdHJpbmcgdG9rZW5LZXk7XHJcblxyXG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgS1ZTIGt2cztcclxuXHJcbiAgICAgICAgcHVibGljIFRyZWVTdGF0ZVN0b3JlKHN0cmluZyBwcmVmaXgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0cmVlU3RhdGVLZXkgPSBwcmVmaXggKyBcIi5UcmVlU3RhdGVWMVwiO1xyXG4gICAgICAgICAgICB0b2tlbktleSA9IHByZWZpeCArIFwiLlRva2VuXCI7XHJcblxyXG4gICAgICAgICAgICBrdnMgPSBuZXcgS1ZTKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgZXZlbnQgRXZlbnRIYW5kbGVyIFN5bmNUb2tlbkNoYW5nZWQ7XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdHJpbmcgU3luY1Rva2VuXHJcbntcclxuICAgIGdldFxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBXaW5kb3cuTG9jYWxTdG9yYWdlLkdldEl0ZW0odG9rZW5LZXkpIGFzIHN0cmluZztcclxuICAgIH1cclxuXHJcbiAgICBcclxuICAgIHNldFxyXG4gICAge1xyXG4gICAgICAgIFdpbmRvdy5Mb2NhbFN0b3JhZ2UuU2V0SXRlbSh0b2tlbktleSwgdmFsdWUpO1xyXG4gICAgICAgIFN5bmNUb2tlbkNoYW5nZWQhPW51bGw/Z2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkZyb21MYW1iZGEoKCk9PlN5bmNUb2tlbkNoYW5nZWQuSW52b2tlKHRoaXMsIEV2ZW50QXJncy5FbXB0eSkpOm51bGw7XHJcbiAgICB9XHJcbn1cclxuICAgICAgICBwdWJsaWMgYXN5bmMgVGFzazxUcmVlU3RhdGU+IEdldCgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgY2xvdWRTdGF0ZSA9IGF3YWl0IFN0YXRlRnJvbUt2c0FzeW5jKCk7XHJcbiAgICAgICAgICAgIHJldHVybiBjbG91ZFN0YXRlID8/IExvYWRGcm9tTG9jYWxTdG9yYWdlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgYXN5bmMgVGFzayBTZXQoVHJlZVN0YXRlIHRyZWVTdGF0ZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFNhdmVUb0xvY2FsU3RvcmFnZSh0cmVlU3RhdGUpO1xyXG4gICAgICAgICAgICBhd2FpdCBTYXZlU3RhdGVUb0t2c0FzeW5jKHRyZWVTdGF0ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHZvaWQgU2F2ZVRvTG9jYWxTdG9yYWdlKFRyZWVTdGF0ZSB0cmVlU3RhdGUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAodHJlZVN0YXRlID09IG51bGwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFdpbmRvdy5Mb2NhbFN0b3JhZ2UuUmVtb3ZlSXRlbSh0cmVlU3RhdGVLZXkpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YXIgdHJlZUpzb24gPSBKc29uQ29udmVydC5TZXJpYWxpemVPYmplY3QodHJlZVN0YXRlKTtcclxuICAgICAgICAgICAgV2luZG93LkxvY2FsU3RvcmFnZS5TZXRJdGVtKHRyZWVTdGF0ZUtleSwgdHJlZUpzb24pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBUcmVlU3RhdGUgTG9hZEZyb21Mb2NhbFN0b3JhZ2UoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIHRyZWVKc29uID0gV2luZG93LkxvY2FsU3RvcmFnZS5HZXRJdGVtKHRyZWVTdGF0ZUtleSkgYXMgc3RyaW5nO1xyXG5cclxuICAgICAgICAgICAgaWYgKHN0cmluZy5Jc051bGxPcldoaXRlU3BhY2UodHJlZUpzb24pKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIEpzb25Db252ZXJ0LkRlc2VyaWFsaXplT2JqZWN0PFRyZWVTdGF0ZT4odHJlZUpzb24pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBhc3luYyBUYXNrPFRyZWVTdGF0ZT4gU3RhdGVGcm9tS3ZzQXN5bmMoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIHJlc3AgPSBhd2FpdCBrdnMuR2V0QXN5bmMoU3luY1Rva2VuKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChyZXNwLlN0YXR1c0NvZGUgPT0gMjAwKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZiAoc3RyaW5nLklzTnVsbE9yV2hpdGVTcGFjZShyZXNwLkNvbnRlbnQpKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiBKc29uQ29udmVydC5EZXNlcmlhbGl6ZU9iamVjdDxUcmVlU3RhdGU+KHJlc3AuQ29udGVudCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChyZXNwLlN0YXR1c0NvZGUgPj0gNDAwICYmIHJlc3AuU3RhdHVzQ29kZSA8PSA0OTkpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIC8vIG5vdCBmb3VuZCwgZ2V0IG5ldyB0b2tlblxyXG4gICAgICAgICAgICAgICAgcmVzcCA9IGF3YWl0IGt2cy5OZXdBc3luYygpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChyZXNwLlN0YXR1c0NvZGUgPT0gMjAwKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIFN5bmNUb2tlbiA9IHJlc3AuQ29udGVudDtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKFwiRmFpbGVkIHRvIGdldCBuZXcgdG9rZW5cIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFeGNlcHRpb24oXCJGYWlsZWQgdG8gZ2V0IHRyZWUgc3RhdGUgZnJvbSBrZXlzdG9yZVwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgYXN5bmMgVGFzayBTYXZlU3RhdGVUb0t2c0FzeW5jKFRyZWVTdGF0ZSBzdGF0ZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBkYXRhID0gc3RhdGUgPT0gbnVsbCA/IHN0cmluZy5FbXB0eSA6IEpzb25Db252ZXJ0LlNlcmlhbGl6ZU9iamVjdChzdGF0ZSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgcmVzcCA9IGF3YWl0IGt2cy5TZXRBc3luYyhTeW5jVG9rZW4sIGRhdGEpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHJlc3AuU3RhdHVzQ29kZSAhPSAyMDApXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJlc3AgPSBhd2FpdCBrdnMuTmV3QXN5bmMoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAocmVzcC5TdGF0dXNDb2RlID09IDIwMClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBhd2FpdCBrdnMuU2V0QXN5bmMoU3luY1Rva2VuLCBkYXRhKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy92YXIgcmVzID0gV2luZG93LkxvY2FsU3RvcmFnZS5HZXRJdGVtKGNvbmZpZy5TZXR0aW5nUHJlZml4ICsgXCIuVG9rZW5cIikgYXMgc3RyaW5nO1xyXG4gICAgICAgIC8vdmFyIGVtcGYgPSByZXMgPT0gbnVsbDtcclxuICAgICAgICAvL0NvbnNvbGUuV3JpdGUoXCJSZXM6IFwiICsgZW1wZik7XHJcblxyXG4gICAgICAgIC8vVGFzay5cclxuICAgICAgICAvL1Rhc2suRnJvbUNhbGxiYWNrKClcclxuXHJcblxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjbGFzcyBIdHRwUmVzcG9uc2VcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgSHR0cFJlc3BvbnNlKHVzaG9ydCBzdGF0dXNDb2RlLCBzdHJpbmcgY29udGVudClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFN0YXR1c0NvZGUgPSBzdGF0dXNDb2RlO1xyXG4gICAgICAgICAgICBDb250ZW50ID0gY29udGVudDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB1c2hvcnQgU3RhdHVzQ29kZSB7IGdldDsgcHJpdmF0ZSBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgc3RyaW5nIENvbnRlbnQgeyBnZXQ7IHByaXZhdGUgc2V0OyB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNsYXNzIEtWU1xyXG4gICAge1xyXG4gICAgICAgIHByaXZhdGUgY29uc3Qgc3RyaW5nIGJhc2VVcmwgPSBcImh0dHBzOi8vYXBpLmtleXZhbHVlLnh5ei9cIjtcclxuICAgICAgICBwcml2YXRlIGNvbnN0IGludCBiYXNlVXJsTGVuID0gMjU7XHJcbiAgICAgICAgcHJpdmF0ZSBjb25zdCBzdHJpbmcgc3VmZml4ID0gXCJ0cmVlXCI7XHJcblxyXG4gICAgICAgIHB1YmxpYyBhc3luYyBUYXNrPEh0dHBSZXNwb25zZT4gTmV3QXN5bmMoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIHVybCA9IEdldFVybFdpdGhUb2tlbihcIm5ld1wiKTtcclxuXHJcbiAgICAgICAgICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgICAgICAgICAgeGhyLk9wZW4oXCJQT1NUXCIsIHVybCk7XHJcblxyXG4gICAgICAgICAgICB2YXIgc291cmNlID0gR2V0Q29tcGxldGlvblNvdXJjZUZvclJlcXVlc3QoeGhyKTtcclxuICAgICAgICAgICAgeGhyLlNlbmQoKTtcclxuXHJcbiAgICAgICAgICAgIHZhciByZXNwID0gYXdhaXQgc291cmNlLlRhc2s7XHJcblxyXG4gICAgICAgICAgICBpZiAocmVzcC5TdGF0dXNDb2RlICE9IDIwMClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3A7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgSHR0cFJlc3BvbnNlKDIwMCwgR2V0VG9rZW5Gcm9tVXJsKHJlc3AuQ29udGVudCkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIFRhc2s8SHR0cFJlc3BvbnNlPiBHZXRBc3luYyhzdHJpbmcgdG9rZW4pXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgdXJsID0gR2V0VXJsV2l0aFRva2VuKHRva2VuKTtcclxuXHJcbiAgICAgICAgICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgICAgICAgICAgeGhyLk9wZW4oXCJHRVRcIiwgdXJsKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBzb3VyY2UgPSBHZXRDb21wbGV0aW9uU291cmNlRm9yUmVxdWVzdCh4aHIpO1xyXG4gICAgICAgICAgICB4aHIuU2VuZCgpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHNvdXJjZS5UYXNrO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIFRhc2s8SHR0cFJlc3BvbnNlPiBTZXRBc3luYyhzdHJpbmcgdG9rZW4sIHN0cmluZyB2YWx1ZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciB1cmwgPSBHZXRVcmxXaXRoVG9rZW4odG9rZW4pO1xyXG5cclxuICAgICAgICAgICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgICAgICAgICB4aHIuT3BlbihcIlBPU1RcIiwgdXJsKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBzb3VyY2UgPSBHZXRDb21wbGV0aW9uU291cmNlRm9yUmVxdWVzdCh4aHIpO1xyXG4gICAgICAgICAgICB4aHIuU2VuZCh2YWx1ZSk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gc291cmNlLlRhc2s7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHN0YXRpYyBUYXNrQ29tcGxldGlvblNvdXJjZTxIdHRwUmVzcG9uc2U+IEdldENvbXBsZXRpb25Tb3VyY2VGb3JSZXF1ZXN0KFhNTEh0dHBSZXF1ZXN0IHhocilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBzb3VyY2UgPSBuZXcgVGFza0NvbXBsZXRpb25Tb3VyY2U8SHR0cFJlc3BvbnNlPigpO1xyXG5cclxuICAgICAgICAgICAgeGhyLk9uTG9hZCA9IGEgPT5cclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdmFyIHJlcyA9IG5ldyBIdHRwUmVzcG9uc2UoeGhyLlN0YXR1cywgeGhyLlJlc3BvbnNlVGV4dCk7XHJcbiAgICAgICAgICAgICAgICBzb3VyY2UuU2V0UmVzdWx0KHJlcyk7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICB4aHIuT25BYm9ydCA9IGEgPT4gc291cmNlLlNldENhbmNlbGVkKCk7XHJcbiAgICAgICAgICAgIHhoci5PbkVycm9yID0gYSA9PiBzb3VyY2UuU2V0RXhjZXB0aW9uKG5ldyBFeGNlcHRpb24oXCJFcnJvclwiKSk7XHJcbiAgICAgICAgICAgIHhoci5PblRpbWVvdXQgPSBhID0+IHNvdXJjZS5TZXRFeGNlcHRpb24obmV3IEV4Y2VwdGlvbihcIlRpbWVvdXRcIikpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHNvdXJjZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgc3RhdGljIHN0cmluZyBHZXRVcmxXaXRoVG9rZW4oc3RyaW5nIHRva2VuKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuIHN0cmluZy5Gb3JtYXQoXCJ7MH17MX0vezJ9XCIsYmFzZVVybCx0b2tlbixzdWZmaXgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgc3RyaW5nIEdldFRva2VuRnJvbVVybChzdHJpbmcgdXJsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIHBhdGggPSB1cmwuU3Vic3RyaW5nKGJhc2VVcmxMZW4pO1xyXG4gICAgICAgICAgICB2YXIgaW5kZXhTbGFzaCA9IHBhdGguSW5kZXhPZignLycpO1xyXG4gICAgICAgICAgICByZXR1cm4gcGF0aC5TdWJzdHJpbmcoMCwgaW5kZXhTbGFzaCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIEJyaWRnZS5IdG1sNTtcclxudXNpbmcgU3lzdGVtO1xyXG5cclxubmFtZXNwYWNlIFdpc2NoaS5MRDQ2LktlZXBJdEFsaXZlLkJyaWRnZU5ldFxyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgTG9hZGluZ0RyYXdlclxyXG4gICAge1xyXG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEIGN0eDtcclxuXHJcbiAgICAgICAgcHVibGljIExvYWRpbmdEcmF3ZXIoSFRNTENhbnZhc0VsZW1lbnQgY2FudmFzKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY3R4ID0gY2FudmFzLkdldENvbnRleHQoQ2FudmFzVHlwZXMuQ2FudmFzQ29udGV4dDJEVHlwZS5DYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgRHJhdygpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjdHguRmlsbFN0eWxlID0gXCIjQjJGRkZGXCI7XHJcbiAgICAgICAgICAgIGN0eC5DbGVhclJlY3QoMCwgMCwgNTEyLCA1MTIpO1xyXG4gICAgICAgICAgICBjdHguRmlsbFJlY3QoMCwgMCwgNTEyLCA1MTIpO1xyXG5cclxuICAgICAgICAgICAgY3R4LkZpbGxTdHlsZSA9IFwiIzAwMFwiO1xyXG4gICAgICAgICAgICBjdHguRm9udCA9IFwiYm9sZCAxNnB4IEFyaWFsLCBzYW5zLXNlcmlmXCI7XHJcblxyXG4gICAgICAgICAgICBjdHguRmlsbFRleHQoXCJMb2FkaW5nLi4uXCIsIDcsIDIwKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNsYXNzIFRyZWVEcmF3ZXJcclxuICAgIHtcclxuICAgICAgICBwcml2YXRlIHJlYWRvbmx5IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCBjdHg7XHJcbiAgICAgICAgcHJpdmF0ZSByZWFkb25seSBSYW5kb20gcm5kID0gbmV3IFJhbmRvbSgpO1xyXG5cclxuICAgICAgICBwcml2YXRlIHJlYWRvbmx5IFRyZWVEcmF3aW5nQ29udGV4dCB0cmVlRHJhd2luZ0NvbnRleHQ7XHJcbiAgICAgICAgcHJpdmF0ZSByZWFkb25seSBIVE1MSW1hZ2VFbGVtZW50IHdhdGVyO1xyXG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgSFRNTEltYWdlRWxlbWVudCByZXNldDtcclxuICAgICAgICBwcml2YXRlIHJlYWRvbmx5IFNoYXJlZERyYXdpbmdTdGF0ZSBzaGFyZWREcmF3aW5nU3RhdGU7XHJcblxyXG4gICAgICAgIHByaXZhdGUgVHJlZVNlZ21lbnQgdHJ1bms7XHJcbiAgICAgICAgcHJpdmF0ZSBSYW5kb21XcmFwcGVyIGdyYXNzUmFuZG9tO1xyXG5cclxuICAgICAgICBwcml2YXRlIGNvbnN0IGludCBDYW52YXNXaWR0aCA9IDUxMjtcclxuICAgICAgICBwcml2YXRlIGNvbnN0IGludCBDYW52YXNIZWlnaHQgPSA1MTI7XHJcbiAgICAgICAgcHJpdmF0ZSBjb25zdCBkb3VibGUgU2NhbGVGYWN0b3IgPSA4MDtcclxuICAgICAgICBwcml2YXRlIGNvbnN0IGludCBUcmVlWU9mZnNldCA9IDQyMDtcclxucHJpdmF0ZSBzdHJpbmcgU2t5Q29sb3Jcclxue1xyXG4gICAgZ2V0XHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHNoYXJlZERyYXdpbmdTdGF0ZS5Jc0RlYWQgPyBcIiM0NDRcIiA6IFwiI0IyRkZGRlwiO1xyXG4gICAgfVxyXG59cHJpdmF0ZSBzdHJpbmcgR3Jhc3NCYWNrZ3JvdW5kQ29sb3Jcclxue1xyXG4gICAgZ2V0XHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHNoYXJlZERyYXdpbmdTdGF0ZS5Jc0RlYWQgPyBcIiMzMzNcIiA6IFwiIzdFQzg1MFwiO1xyXG4gICAgfVxyXG59cHJpdmF0ZSBzdHJpbmcgR3Jhc3NDb2xvclxyXG57XHJcbiAgICBnZXRcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gc2hhcmVkRHJhd2luZ1N0YXRlLklzRGVhZCA/IFwiIzExMVwiIDogXCIjMjA2NDExXCI7XHJcbiAgICB9XHJcbn1cclxuICAgICAgICBwcml2YXRlIGludD8gY3VycmVudFNlZWQgPSBudWxsO1xyXG5cclxuICAgICAgICBwdWJsaWMgVHJlZURyYXdlcihcclxuICAgICAgICAgICAgSFRNTENhbnZhc0VsZW1lbnQgY2FudmFzLFxyXG4gICAgICAgICAgICBIVE1MSW1hZ2VFbGVtZW50IHdhdGVyLFxyXG4gICAgICAgICAgICBIVE1MSW1hZ2VFbGVtZW50IHJlc2V0LFxyXG4gICAgICAgICAgICBTaGFyZWREcmF3aW5nU3RhdGUgc2hhcmVkRHJhd2luZ1N0YXRlXHJcbiAgICAgICAgKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy53YXRlciA9IHdhdGVyID8/ICgoU3lzdGVtLkZ1bmM8SFRNTEltYWdlRWxlbWVudD4pKCgpPT57dGhyb3cgbmV3IEFyZ3VtZW50TnVsbEV4Y2VwdGlvbihcIndhdGVyXCIpO30pKSgpO1xyXG4gICAgICAgICAgICB0aGlzLnJlc2V0ID0gcmVzZXQgPz8gKChTeXN0ZW0uRnVuYzxIVE1MSW1hZ2VFbGVtZW50PikoKCk9Pnt0aHJvdyBuZXcgQXJndW1lbnROdWxsRXhjZXB0aW9uKFwicmVzZXRcIik7fSkpKCk7XHJcbiAgICAgICAgICAgIHRoaXMuc2hhcmVkRHJhd2luZ1N0YXRlID0gc2hhcmVkRHJhd2luZ1N0YXRlID8/ICgoU3lzdGVtLkZ1bmM8U2hhcmVkRHJhd2luZ1N0YXRlPikoKCk9Pnt0aHJvdyBuZXcgQXJndW1lbnROdWxsRXhjZXB0aW9uKFwic2hhcmVkRHJhd2luZ1N0YXRlXCIpO30pKSgpO1xyXG5cclxuICAgICAgICAgICAgY2FudmFzLldpZHRoID0gQ2FudmFzV2lkdGg7XHJcbiAgICAgICAgICAgIGNhbnZhcy5IZWlnaHQgPSBDYW52YXNIZWlnaHQ7XHJcblxyXG4gICAgICAgICAgICBjdHggPSBjYW52YXMuR2V0Q29udGV4dChDYW52YXNUeXBlcy5DYW52YXNDb250ZXh0MkRUeXBlLkNhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCk7XHJcblxyXG4gICAgICAgICAgICB0cmVlRHJhd2luZ0NvbnRleHQgPSBuZXcgVHJlZURyYXdpbmdDb250ZXh0KGN0eClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgU2NhbGVGYWN0b3IgPSBTY2FsZUZhY3RvcixcclxuICAgICAgICAgICAgICAgIFN0YXJ0WCA9IENhbnZhc1dpZHRoIC8gMixcclxuICAgICAgICAgICAgICAgIFN0YXJ0WSA9IFRyZWVZT2Zmc2V0LFxyXG4gICAgICAgICAgICAgICAgTGVhZkxpbWl0ID0gMC4wMlxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSB2b2lkIFVwZGF0ZVNlZWQoaW50IG5ld1NlZWQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgdHJlZVJuZFNvdXJjZSA9IG5ldyBSYW5kb21XcmFwcGVyKG5ld1NlZWQpO1xyXG4gICAgICAgICAgICB2YXIgdHJlZUJ1aWxkZXIgPSBuZXcgVHJlZUJ1aWxkZXIodHJlZVJuZFNvdXJjZSk7XHJcblxyXG4gICAgICAgICAgICB0cnVuayA9IHRyZWVCdWlsZGVyLkJ1aWxkVHJlZSgpO1xyXG4gICAgICAgICAgICBncmFzc1JhbmRvbSA9IG5ldyBSYW5kb21XcmFwcGVyKG5ld1NlZWQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBib29sIHdhdGVySW5mb1dhc1Nob3duID0gZmFsc2U7XHJcbiAgICAgICAgcHJpdmF0ZSBib29sIHdhdGVySW5mb0RlYWN0aXZhdGVkID0gZmFsc2U7XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIERyYXcoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKHNoYXJlZERyYXdpbmdTdGF0ZS5TZWVkICE9IGN1cnJlbnRTZWVkKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBVcGRhdGVTZWVkKHNoYXJlZERyYXdpbmdTdGF0ZS5TZWVkKTtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRTZWVkID0gc2hhcmVkRHJhd2luZ1N0YXRlLlNlZWQ7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChjdXJyZW50U2VlZCA9PSBudWxsKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGdyYXNzUmFuZG9tLlJlc2V0KCk7XHJcblxyXG4gICAgICAgICAgICBjdHguRmlsbFN0eWxlID0gU2t5Q29sb3I7XHJcbiAgICAgICAgICAgIGN0eC5DbGVhclJlY3QoMCwgMCwgNTEyLCA1MTIpO1xyXG4gICAgICAgICAgICBjdHguRmlsbFJlY3QoMCwgMCwgNTEyLCA1MTIpO1xyXG5cclxuICAgICAgICAgICAgdHJlZURyYXdpbmdDb250ZXh0Lkdyb3d0aEZhY3RvciA9IEVhc2luZ0hlbHBlci5FYXNlT3V0UXVhZChzaGFyZWREcmF3aW5nU3RhdGUuR3Jvd3RoQ29udHJvbCAqIDAuNzUgKyAwLjI1KTtcclxuICAgICAgICAgICAgdHJlZURyYXdpbmdDb250ZXh0LkxlYWZGYWN0b3IgPSBzaGFyZWREcmF3aW5nU3RhdGUuVGhpY2tuZXNzQ29udHJvbCAqIDAuOTtcclxuICAgICAgICAgICAgdHJlZURyYXdpbmdDb250ZXh0LklzRGVhZCA9IHNoYXJlZERyYXdpbmdTdGF0ZS5Jc0RlYWQ7XHJcblxyXG4gICAgICAgICAgICB2YXIgZ3Jhc3NIZWlnaHQgPSBUcmVlWU9mZnNldCAtIDUwO1xyXG4gICAgICAgICAgICBjdHguRmlsbFN0eWxlID0gR3Jhc3NCYWNrZ3JvdW5kQ29sb3I7XHJcbiAgICAgICAgICAgIGN0eC5GaWxsUmVjdCgwLCBncmFzc0hlaWdodCwgQ2FudmFzV2lkdGgsIENhbnZhc0hlaWdodCAtIGdyYXNzSGVpZ2h0KTtcclxuXHJcbiAgICAgICAgICAgIHZhciBncmFzc0ZvcmVncm91bmRMaW1pdCA9IFRyZWVZT2Zmc2V0IC0gMjA7XHJcblxyXG4gICAgICAgICAgICBmb3IgKHZhciB5ID0gZ3Jhc3NIZWlnaHQgLSAxMDsgeSA8IGdyYXNzRm9yZWdyb3VuZExpbWl0OyB5ICs9IDUpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIERyYXdHcmFzcyh5LCA1MTIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0cmVlRHJhd2luZ0NvbnRleHQuRHJhd1RyZWUodHJ1bmspO1xyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgeSA9IGdyYXNzRm9yZWdyb3VuZExpbWl0OyB5IDwgQ2FudmFzSGVpZ2h0OyB5ICs9IDUpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIERyYXdHcmFzcyh5LCA1MTIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBEcmF3V2F0ZXJIVUQoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgdm9pZCBEcmF3V2F0ZXJIVUQoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgLy8gZHJhdyBodWRcclxuICAgICAgICAgICAgdmFyIGhlaWdodCA9IDMwO1xyXG4gICAgICAgICAgICB2YXIgbWFyZ2luID0gMTA7XHJcbiAgICAgICAgICAgIHZhciBtYXJnaW5MZWZ0ID0gNTA7XHJcbiAgICAgICAgICAgIHZhciBtYXJnaW5Cb3R0b20gPSAyMDtcclxuICAgICAgICAgICAgdmFyIHBhZGRpbmcgPSA1O1xyXG5cclxuICAgICAgICAgICAgdmFyIHdhdGVyUHJlZGl0aW9uID0gMDtcclxuXHJcbiAgICAgICAgICAgIGlmIChzaGFyZWREcmF3aW5nU3RhdGUuV2F0ZXJBbW91bnQgKyBzaGFyZWREcmF3aW5nU3RhdGUuV2F0ZXJEZWx0YSA+IDEpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHdhdGVyUHJlZGl0aW9uID0gMTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCFzaGFyZWREcmF3aW5nU3RhdGUuSXNEZWFkKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAvLyB3aGl0ZSBodWQgYmdcclxuICAgICAgICAgICAgICAgIGN0eC5GaWxsU3R5bGUgPSBcIiNCMkZGRkY2MFwiO1xyXG4gICAgICAgICAgICAgICAgY3R4LkZpbGxSZWN0KDAgKyBtYXJnaW5MZWZ0LCBDYW52YXNIZWlnaHQgLSBtYXJnaW5Cb3R0b20gLSAyICogcGFkZGluZyAtIGhlaWdodCwgQ2FudmFzV2lkdGggLSBtYXJnaW4gLSBtYXJnaW5MZWZ0LCBoZWlnaHQgKyAyICogcGFkZGluZyk7XHJcblxyXG4gICAgICAgICAgICAgICAgY3R4LkZpbGxTdHlsZSA9IFwiIzAwNzdCRTgwXCI7XHJcbiAgICAgICAgICAgICAgICBjdHguRmlsbFJlY3QoMCArIG1hcmdpbkxlZnQgKyBwYWRkaW5nLCBDYW52YXNIZWlnaHQgLSBtYXJnaW5Cb3R0b20gLSBwYWRkaW5nIC0gaGVpZ2h0LCAoQ2FudmFzV2lkdGggLSAyICogcGFkZGluZyAtIG1hcmdpbiAtIG1hcmdpbkxlZnQpICogd2F0ZXJQcmVkaXRpb24sIGhlaWdodCk7XHJcblxyXG4gICAgICAgICAgICAgICAgY3R4LkZpbGxTdHlsZSA9IFwiIzAwNzdCRVwiO1xyXG4gICAgICAgICAgICAgICAgY3R4LkZpbGxSZWN0KDAgKyBtYXJnaW5MZWZ0ICsgcGFkZGluZywgQ2FudmFzSGVpZ2h0IC0gbWFyZ2luQm90dG9tIC0gcGFkZGluZyAtIGhlaWdodCwgKGludCkoKENhbnZhc1dpZHRoIC0gMiAqIHBhZGRpbmcgLSBtYXJnaW4gLSBtYXJnaW5MZWZ0KSAqIHNoYXJlZERyYXdpbmdTdGF0ZS5XYXRlckFtb3VudCksIGhlaWdodCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciBpY29uID0gd2F0ZXI7XHJcbiAgICAgICAgICAgIHZhciBpY29uTGVmdCA9IDU7XHJcblxyXG4gICAgICAgICAgICBpZiAoc2hhcmVkRHJhd2luZ1N0YXRlLklzRGVhZClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWNvbkxlZnQgPSAyMDtcclxuICAgICAgICAgICAgICAgIGljb24gPSByZXNldDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY3R4LkltYWdlU21vb3RoaW5nRW5hYmxlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIGN0eC5EcmF3SW1hZ2UoaWNvbiwgaWNvbkxlZnQsIENhbnZhc0hlaWdodCAtIDY0IC0gMTUsIDY0ZCwgNjRkKTtcclxuXHJcbiAgICAgICAgICAgIGN0eC5GaWxsU3R5bGUgPSBcIiMwMDBcIjtcclxuICAgICAgICAgICAgY3R4LkZvbnQgPSBcImJvbGQgMTZweCBBcmlhbCwgc2Fucy1zZXJpZlwiO1xyXG5cclxuICAgICAgICAgICAgdmFyIHRleHQgPSBcIlwiO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFzaGFyZWREcmF3aW5nU3RhdGUuSXNEZWFkKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB2YXIgbGFzdFdhdGVyaW5mbyA9IHdhdGVySW5mb1dhc1Nob3duO1xyXG4gICAgICAgICAgICAgICAgd2F0ZXJJbmZvV2FzU2hvd24gPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoKHNoYXJlZERyYXdpbmdTdGF0ZS5XYXRlckFtb3VudCA8IDAuNSAmJiAhd2F0ZXJJbmZvRGVhY3RpdmF0ZWQpIHx8IHNoYXJlZERyYXdpbmdTdGF0ZS5XYXRlckFtb3VudCA8IDAuMDAxKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHRleHQgPSBcIuKvhyBjbGljayB0byB3YXRlciB5b3VyIHRyZWVcIjtcclxuICAgICAgICAgICAgICAgICAgICB3YXRlckluZm9XYXNTaG93biA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChzaGFyZWREcmF3aW5nU3RhdGUuV2F0ZXJBbW91bnQgPiAwLjk5OSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB0ZXh0ID0gXCJzd2FtcGVkXCI7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGxhc3RXYXRlcmluZm8gJiYgIXdhdGVySW5mb1dhc1Nob3duKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHdhdGVySW5mb0RlYWN0aXZhdGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGN0eC5Gb250ID0gXCJib2xkIDI0cHggQXJpYWwsIHNhbnMtc2VyaWZcIjtcclxuICAgICAgICAgICAgICAgIG1hcmdpbkxlZnQgKz0gMzA7XHJcbiAgICAgICAgICAgICAgICAvL3RleHQgPSBcIuKvhyBjbGljayB0byByZXN0YXJ0XCI7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGN0eC5GaWxsVGV4dCh0ZXh0LCBtYXJnaW5MZWZ0ICsgcGFkZGluZyArIDE1LCBDYW52YXNIZWlnaHQgLSBtYXJnaW5Cb3R0b20gLSBwYWRkaW5nIC0gMTApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSB2b2lkIERyYXdHcmFzcyhpbnQgeSwgaW50IGFtb3VudClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBncmFzc1NjYWxlID0gMC4yICogU2NhbGVGYWN0b3I7XHJcblxyXG4gICAgICAgICAgICBjdHguU3Ryb2tlU3R5bGUgPSBHcmFzc0NvbG9yO1xyXG4gICAgICAgICAgICBjdHguTGluZVdpZHRoID0gZ3Jhc3NTY2FsZSAqIDAuMDI1O1xyXG5cclxuICAgICAgICAgICAgY3R4LkJlZ2luUGF0aCgpO1xyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhbW91bnQ7IGkrKylcclxuICAgICAgICAgICAge1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciB4ID0gZ3Jhc3NSYW5kb20uTmV4dERvdWJsZSgpICogQ2FudmFzV2lkdGg7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIG9mZnNldHggPSBncmFzc1JhbmRvbS5OZXh0RG91YmxlKCkgLSAwLjU7XHJcbiAgICAgICAgICAgICAgICB2YXIgb2Zmc2V0WSA9IGdyYXNzUmFuZG9tLk5leHREb3VibGUoKSAtIDAuNTtcclxuICAgICAgICAgICAgICAgIHZhciBoZWlnaHQgPSBncmFzc1JhbmRvbS5OZXh0RG91YmxlKCkgKiAwLjcgKyAwLjM7XHJcblxyXG4gICAgICAgICAgICAgICAgY3R4Lk1vdmVUbyh4LCB5ICsgb2Zmc2V0WSAqIGdyYXNzU2NhbGUpO1xyXG4gICAgICAgICAgICAgICAgY3R4LkxpbmVUbyh4ICsgb2Zmc2V0eCAqIGdyYXNzU2NhbGUsIHkgKyBvZmZzZXRZICogZ3Jhc3NTY2FsZSArIGhlaWdodCAqIGdyYXNzU2NhbGUpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjdHguQ2xvc2VQYXRoKCk7XHJcbiAgICAgICAgICAgIGN0eC5TdHJva2UoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtLlRocmVhZGluZy5UYXNrcztcclxuXHJcbm5hbWVzcGFjZSBXaXNjaGkuTEQ0Ni5LZWVwSXRBbGl2ZS5CcmlkZ2VOZXRcclxue1xyXG4gICAgcHVibGljIHN0YXRpYyBjbGFzcyBUYXNrWFxyXG4gICAge1xyXG4gICAgICAgIC8vIFdvcmthcm91bmQgZm9yIG1pc3NpbmcgVGFzay5Db21wbGV0ZWRUYXNrXHJcbiAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2JyaWRnZWRvdG5ldC9CcmlkZ2UvaXNzdWVzLzMyMDFcclxuICAgICAgICBwdWJsaWMgc3RhdGljIFRhc2sgQ29tcGxldGVkVGFzayB7IGdldDsgcHJpdmF0ZSBzZXQ7IH1cclxuXG4gICAgXG5wcml2YXRlIHN0YXRpYyBUYXNrIF9fUHJvcGVydHlfX0luaXRpYWxpemVyX19Db21wbGV0ZWRUYXNrPVRhc2suRGVsYXkoMCk7fVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgU3lzdGVtLlRocmVhZGluZy5UYXNrcztcclxuXHJcbm5hbWVzcGFjZSBXaXNjaGkuTEQ0Ni5LZWVwSXRBbGl2ZS5CcmlkZ2VOZXRcclxue1xyXG4gICAgcHVibGljIGNsYXNzIFRyZWVBcHBDb250ZXh0XHJcbiAgICB7XHJcbiAgICAgICAgcHJpdmF0ZSByZWFkb25seSBJQ2xvY2sgY2xvY2s7XHJcbiAgICAgICAgcHJpdmF0ZSByZWFkb25seSBUcmVlRW52aXJvbm1lbnRDb25maWcgY29uZmlnO1xyXG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgVHJlZVN0YXRlU3RvcmUgdHJlZVN0YXRlU3RvcmU7XHJcbiAgICAgICAgcHJpdmF0ZSByZWFkb25seSBUcmVlU3RhdGVGYWN0b3J5IHRyZWVTdGF0ZUZhY3Rvcnk7XHJcbiAgICAgICAgcHJpdmF0ZSByZWFkb25seSBTaGFyZWREcmF3aW5nU3RhdGUgc2hhcmVkRHJhd2luZ1N0YXRlO1xyXG5cclxuICAgICAgICBwdWJsaWMgVHJlZUFwcENvbnRleHQoXHJcbiAgICAgICAgICAgIElDbG9jayBjbG9jayxcclxuICAgICAgICAgICAgVHJlZUVudmlyb25tZW50Q29uZmlnIGNvbmZpZyxcclxuICAgICAgICAgICAgVHJlZVN0YXRlU3RvcmUgdHJlZVN0YXRlU3RvcmUsXHJcbiAgICAgICAgICAgIFRyZWVTdGF0ZUZhY3RvcnkgdHJlZVN0YXRlRmFjdG9yeSxcclxuICAgICAgICAgICAgU2hhcmVkRHJhd2luZ1N0YXRlIHNoYXJlZERyYXdpbmdTdGF0ZVxyXG4gICAgICAgIClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuY2xvY2sgPSBjbG9jayA/PyAoKFN5c3RlbS5GdW5jPElDbG9jaz4pKCgpPT57dGhyb3cgbmV3IEFyZ3VtZW50TnVsbEV4Y2VwdGlvbihcImNsb2NrXCIpO30pKSgpO1xyXG4gICAgICAgICAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZyA/PyAoKFN5c3RlbS5GdW5jPFRyZWVFbnZpcm9ubWVudENvbmZpZz4pKCgpPT57dGhyb3cgbmV3IEFyZ3VtZW50TnVsbEV4Y2VwdGlvbihcImNvbmZpZ1wiKTt9KSkoKTtcclxuICAgICAgICAgICAgdGhpcy50cmVlU3RhdGVTdG9yZSA9IHRyZWVTdGF0ZVN0b3JlID8/ICgoU3lzdGVtLkZ1bmM8VHJlZVN0YXRlU3RvcmU+KSgoKT0+e3Rocm93IG5ldyBBcmd1bWVudE51bGxFeGNlcHRpb24oXCJ0cmVlU3RhdGVTdG9yZVwiKTt9KSkoKTtcclxuICAgICAgICAgICAgdGhpcy50cmVlU3RhdGVGYWN0b3J5ID0gdHJlZVN0YXRlRmFjdG9yeSA/PyAoKFN5c3RlbS5GdW5jPFRyZWVTdGF0ZUZhY3Rvcnk+KSgoKT0+e3Rocm93IG5ldyBBcmd1bWVudE51bGxFeGNlcHRpb24oXCJ0cmVlU3RhdGVGYWN0b3J5XCIpO30pKSgpO1xyXG4gICAgICAgICAgICB0aGlzLnNoYXJlZERyYXdpbmdTdGF0ZSA9IHNoYXJlZERyYXdpbmdTdGF0ZSA/PyAoKFN5c3RlbS5GdW5jPFNoYXJlZERyYXdpbmdTdGF0ZT4pKCgpPT57dGhyb3cgbmV3IEFyZ3VtZW50TnVsbEV4Y2VwdGlvbihcInNoYXJlZERyYXdpbmdTdGF0ZVwiKTt9KSkoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBUcmVlQmVoYXZpb3VyRW5naW5lIFRyZWVCZWhhdmlvdXIgeyBnZXQ7IHByaXZhdGUgc2V0OyB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBhc3luYyBUYXNrIEluaXRpYWxpemVBc3luYygpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgc3RhdGUgPSBhd2FpdCB0cmVlU3RhdGVTdG9yZS5HZXQoKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChzdGF0ZSA9PSBudWxsKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBzdGF0ZSA9IHRyZWVTdGF0ZUZhY3RvcnkuQ3JlYXRlVHJlZSgpO1xyXG4gICAgICAgICAgICAgICAgYXdhaXQgdHJlZVN0YXRlU3RvcmUuU2V0KHN0YXRlKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgVHJlZUJlaGF2aW91ciA9IG5ldyBUcmVlQmVoYXZpb3VyRW5naW5lKGNvbmZpZywgc3RhdGUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIGFzeW5jIFRhc2sgUmVzZXRUcmVlQXN5bmMoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIHN0YXRlID0gdHJlZVN0YXRlRmFjdG9yeS5DcmVhdGVUcmVlKCk7XHJcbiAgICAgICAgICAgIGF3YWl0IHRyZWVTdGF0ZVN0b3JlLlNldChzdGF0ZSk7XHJcbiAgICAgICAgICAgIFRyZWVCZWhhdmlvdXIgPSBuZXcgVHJlZUJlaGF2aW91ckVuZ2luZShjb25maWcsIHN0YXRlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIFVwZGF0ZUdhbWVTdGF0ZSgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBUcmVlQmVoYXZpb3VyLlVwZGF0ZShjbG9jay5Ob3coKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBVcGRhdGVQcmVSZW5kZXIoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc2hhcmVkRHJhd2luZ1N0YXRlLkdyb3d0aENvbnRyb2wgPSBUcmVlQmVoYXZpb3VyLlRyZWVTdGF0ZS5Hcm93dGg7XHJcbiAgICAgICAgICAgIHNoYXJlZERyYXdpbmdTdGF0ZS5XYXRlckFtb3VudCA9IE1hdGguTWluKDEsIFRyZWVCZWhhdmlvdXIuVHJlZVN0YXRlLldhdGVyTGV2ZWwpO1xyXG4gICAgICAgICAgICBzaGFyZWREcmF3aW5nU3RhdGUuVGhpY2tuZXNzQ29udHJvbCA9IFRyZWVCZWhhdmlvdXIuVHJlZVN0YXRlLkhlYWx0aDtcclxuICAgICAgICAgICAgc2hhcmVkRHJhd2luZ1N0YXRlLldhdGVyRGVsdGEgPSBUcmVlQmVoYXZpb3VyLldhdGVyRGVsdGE7XHJcbiAgICAgICAgICAgIHNoYXJlZERyYXdpbmdTdGF0ZS5Jc0RlYWQgPSBUcmVlQmVoYXZpb3VyLlRyZWVTdGF0ZS5IZWFsdGggPT0gMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBhc3luYyBUYXNrIFdhdGVyQXN5bmMoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgVHJlZUJlaGF2aW91ci5XYXRlcigpO1xyXG4gICAgICAgICAgICBhd2FpdCB0cmVlU3RhdGVTdG9yZS5TZXQoVHJlZUJlaGF2aW91ci5UcmVlU3RhdGUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIGFzeW5jIFRhc2sgQXV0b1NhdmUoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgYXdhaXQgdHJlZVN0YXRlU3RvcmUuU2V0KFRyZWVCZWhhdmlvdXIuVHJlZVN0YXRlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwibmFtZXNwYWNlIFdpc2NoaS5MRDQ2LktlZXBJdEFsaXZlLkJyaWRnZU5ldFxyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgVHJlZUJlaGF2aW91ckVuZ2luZVxyXG4gICAge1xyXG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgUmFuZG9tV3JhcHBlciBybmRTb3VyY2U7XHJcbiAgICAgICAgcHJpdmF0ZSByZWFkb25seSBUcmVlRW52aXJvbm1lbnRDb25maWcgY29uZmlnO1xyXG5cclxuICAgICAgICBwdWJsaWMgVHJlZUJlaGF2aW91ckVuZ2luZShUcmVlRW52aXJvbm1lbnRDb25maWcgY29uZmlnLCBUcmVlU3RhdGUgdHJlZVN0YXRlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5jb25maWcgPSBjb25maWcgPz8gKChTeXN0ZW0uRnVuYzxUcmVlRW52aXJvbm1lbnRDb25maWc+KSgoKT0+e3Rocm93IG5ldyBTeXN0ZW0uQXJndW1lbnROdWxsRXhjZXB0aW9uKFwiY29uZmlnXCIpO30pKSgpO1xyXG4gICAgICAgICAgICB0aGlzLlRyZWVTdGF0ZSA9IHRyZWVTdGF0ZSA/PyAoKFN5c3RlbS5GdW5jPFRyZWVTdGF0ZT4pKCgpPT57dGhyb3cgbmV3IFN5c3RlbS5Bcmd1bWVudE51bGxFeGNlcHRpb24oXCJ0cmVlU3RhdGVcIik7fSkpKCk7XHJcblxyXG4gICAgICAgICAgICBXYXRlckRlbHRhID0gMC4xMjU7XHJcbiAgICAgICAgICAgIHJuZFNvdXJjZSA9IG5ldyBSYW5kb21XcmFwcGVyKHRyZWVTdGF0ZS5TZWVkKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBkb3VibGUgV2F0ZXJEZWx0YSB7IGdldDsgcHJpdmF0ZSBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgVHJlZVN0YXRlIFRyZWVTdGF0ZSB7IGdldDsgcHJpdmF0ZSBzZXQ7IH1cclxucHJpdmF0ZSBib29sIElzSGVhbHRoeVxyXG57XHJcbiAgICBnZXRcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gVHJlZVN0YXRlLldhdGVyTGV2ZWwgPiAwLjAwMSAmJiBUcmVlU3RhdGUuV2F0ZXJMZXZlbCA8PSAxO1xyXG4gICAgfVxyXG59XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIFdhdGVyKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFRyZWVTdGF0ZS5XYXRlckxldmVsICs9IFdhdGVyRGVsdGE7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBVcGRhdGUoZG91YmxlIG5vdylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciB0YXJnZXRUaWNrcyA9IChpbnQpKChub3cgLSBUcmVlU3RhdGUuU3RhcnRUaW1lc3RhbXApIC8gY29uZmlnLk1zVGlja1JhdGUpO1xyXG4gICAgICAgICAgICB2YXIgZGVsdGEgPSB0YXJnZXRUaWNrcyAtIFRyZWVTdGF0ZS5UaWNrcztcclxuXHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGVsdGE7IGkrKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVGljaygpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChUcmVlU3RhdGUuSGVhbHRoIDw9IDApXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gc3RvcCBwcm9jZXNzaW5nIHRpY2tzLCB0cmVlIGlzIGRlYWQgYWxyZWFkeS5cclxuICAgICAgICAgICAgICAgICAgICAvLyBUaGlzIHByZXZlbnRzIGxhZyBpZiB0aGUgdHJlZSB3YXNuJ3Qgb3BlbmVkIGZvciBhIGxvbmcgdGltZVxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBUcmVlU3RhdGUuTGFzdEV2ZW50VGltZXN0YW1wID0gbm93O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSB2b2lkIFRpY2soKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgVHJlZVN0YXRlLlRpY2tzKys7XHJcblxyXG4gICAgICAgICAgICBHcm93dGhUaWNrKCk7XHJcbiAgICAgICAgICAgIFdhdGVyVGljaygpO1xyXG4gICAgICAgICAgICBIZWFsdGhUaWNrKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHZvaWQgR3Jvd3RoVGljaygpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAoVHJlZVN0YXRlLkdyb3d0aCA+PSAxKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBUcmVlU3RhdGUuR3Jvd3RoID0gMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFRyZWVTdGF0ZS5Hcm93dGggKz0gY29uZmlnLk1heEdyb3d0aFJhdGUgKiBUcmVlU3RhdGUuSGVhbHRoO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHZvaWQgV2F0ZXJUaWNrKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciB3RGVsdGEgPSBjb25maWcuTWF4V2F0ZXJSYXRlIC0gY29uZmlnLk1pbldhdGVyUmF0ZTtcclxuICAgICAgICAgICAgdmFyIHdhdGVyQW1vdW50ID0gcm5kU291cmNlLk5leHREb3VibGUoKSAqIHdEZWx0YSArIGNvbmZpZy5NaW5XYXRlclJhdGU7XHJcbiAgICAgICAgICAgIFRyZWVTdGF0ZS5XYXRlckxldmVsIC09IHdhdGVyQW1vdW50O1xyXG5cclxuICAgICAgICAgICAgaWYgKFRyZWVTdGF0ZS5XYXRlckxldmVsIDwgMClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVHJlZVN0YXRlLldhdGVyTGV2ZWwgPSAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHZvaWQgSGVhbHRoVGljaygpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAoVHJlZVN0YXRlLkhlYWx0aCA8PSAwKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBUcmVlU3RhdGUuSGVhbHRoID0gMDtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKElzSGVhbHRoeSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVHJlZVN0YXRlLkhlYWx0aCArPSBjb25maWcuSGVhbFJhdGU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBUcmVlU3RhdGUuSGVhbHRoIC09IGNvbmZpZy5IYXJtUmF0ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKFRyZWVTdGF0ZS5IZWFsdGggPCAwKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBUcmVlU3RhdGUuSGVhbHRoID0gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChUcmVlU3RhdGUuSGVhbHRoID4gMSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVHJlZVN0YXRlLkhlYWx0aCA9IDE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgQnJpZGdlLkh0bWw1O1xyXG51c2luZyBTeXN0ZW07XHJcblxyXG5uYW1lc3BhY2UgV2lzY2hpLkxENDYuS2VlcEl0QWxpdmUuQnJpZGdlTmV0XHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBUcmVlRHJhd2luZ0NvbnRleHRcclxuICAgIHtcclxuICAgICAgICBwcml2YXRlIGNvbnN0IGRvdWJsZSBUQVUgPSA2LjI4MzE4NTMwNzE3OTU4NjI7XHJcblxyXG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEIGN0eDtcclxuXHJcbiAgICAgICAgcHVibGljIFRyZWVEcmF3aW5nQ29udGV4dChDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgY3R4KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5jdHggPSBjdHggPz8gKChTeXN0ZW0uRnVuYzxDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ+KSgoKT0+e3Rocm93IG5ldyBBcmd1bWVudE51bGxFeGNlcHRpb24oXCJjdHhcIik7fSkpKCk7XHJcbiAgICAgICAgfVxyXG5wcml2YXRlIGludCBEZXB0aExpbWl0XHJcbntcclxuICAgIGdldFxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiAxMjtcclxuICAgIH1cclxufVxyXG4gICAgICAgIHB1YmxpYyBkb3VibGUgR3Jvd3RoRmFjdG9yIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgZG91YmxlIFNjYWxlRmFjdG9yIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgZG91YmxlIExlYWZMaW1pdCB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIGRvdWJsZSBTdGFydFggeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBkb3VibGUgU3RhcnRZIHsgZ2V0OyBzZXQ7IH1cclxucHJpdmF0ZSBkb3VibGUgVGhpY2tuZXNzTGltaXRcclxue1xyXG4gICAgZ2V0XHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIExlYWZMaW1pdCAqICgxIC0gTGVhZkZhY3Rvcik7XHJcbiAgICB9XHJcbn0gICAgICAgIHB1YmxpYyBkb3VibGUgTGVhZkZhY3RvciB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIGJvb2wgSXNEZWFkIHsgZ2V0OyBzZXQ7IH1cclxucHJpdmF0ZSBzdHJpbmcgQnJhbmNoQ29sb3Jcclxue1xyXG4gICAgZ2V0XHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIElzRGVhZCA/IFwiIzAwMFwiIDogXCIjNDIxMjA4XCI7XHJcbiAgICB9XHJcbn1cclxuICAgICAgICBwdWJsaWMgdm9pZCBEcmF3VHJlZShUcmVlU2VnbWVudCB0cmVlVHJ1bmspXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAodHJlZVRydW5rID09IG51bGwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBBcmd1bWVudE51bGxFeGNlcHRpb24oXCJ0cmVlVHJ1bmtcIik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIERyYXdTZWdtZW50SW50ZXJuYWwodHJlZVRydW5rLCBTdGFydFgsIFN0YXJ0WSwgMC4yNSAqIFRBVSwgZG91YmxlLk5hTik7XHJcbiAgICAgICAgfVxyXG5wcml2YXRlIEZ1bmM8ZG91YmxlLCBkb3VibGU+IEVhc2VEZXB0aFxyXG57XHJcbiAgICBnZXRcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gRWFzaW5nSGVscGVyLkVhc2VJblF1YWRPZmZzZXQ7XHJcbiAgICB9XHJcbn1wcml2YXRlIEZ1bmM8ZG91YmxlLCBkb3VibGU+IEVhc2VUaGlja25lc3Ncclxue1xyXG4gICAgZ2V0XHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIEVhc2luZ0hlbHBlci5FYXNlSW5RdWFkT2Zmc2V0O1xyXG4gICAgfVxyXG59cHJpdmF0ZSBGdW5jPGRvdWJsZSwgZG91YmxlPiBFYXNlRGV2aWF0aW9uXHJcbntcclxuICAgIGdldFxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBFYXNpbmdIZWxwZXIuRWFzZUxpbmVhcjtcclxuICAgIH1cclxufVxyXG4gICAgICAgIHByaXZhdGUgdm9pZCBEcmF3U2VnbWVudEludGVybmFsKFRyZWVTZWdtZW50IGN1cnJlbnRTZWdtZW50LCBkb3VibGUgeCwgZG91YmxlIHksIGRvdWJsZSBsYXN0QnJhbmNoQWJzb2x1dGVBbmdsZSwgZG91YmxlIGxhc3RUaGlja25lc3MpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgZmxvYXRpbmdEZXB0aCA9IERlcHRoTGltaXQgKiBFYXNlRGVwdGgoR3Jvd3RoRmFjdG9yKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBsb3dlckRlcHRoID0gKGludClmbG9hdGluZ0RlcHRoO1xyXG4gICAgICAgICAgICB2YXIgdXBwZXJEZXB0aCA9IGxvd2VyRGVwdGggKyAxO1xyXG5cclxuICAgICAgICAgICAgaWYgKGN1cnJlbnRTZWdtZW50LkRlcHRoID4gdXBwZXJEZXB0aClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YXIgZGVwdGhMZW5ndGhTY2FsZSA9IE1hdGguTWF4KE1hdGguTWluKDEuMCwgZmxvYXRpbmdEZXB0aCAtIGN1cnJlbnRTZWdtZW50LkRlcHRoKSwgMCk7XHJcblxyXG4gICAgICAgICAgICB2YXIgZWZmZWN0aXZlRGV2aWF0aW9uQW5nbGUgPSBjdXJyZW50U2VnbWVudC5EZXZpYXRpb25BbmdsZSAqIChFYXNlRGV2aWF0aW9uKEdyb3d0aEZhY3RvcikgKiAwLjMgKyAwLjcpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGN1cnJlbnRCcmFuY2hBYnNvbHV0ZUFuZ2xlID0gbGFzdEJyYW5jaEFic29sdXRlQW5nbGUgKyBlZmZlY3RpdmVEZXZpYXRpb25BbmdsZTtcclxuICAgICAgICAgICAgdmFyIGxlbmd0aCA9IGN1cnJlbnRTZWdtZW50Lkxlbmd0aCAqIEdyb3d0aEZhY3RvciAqIGRlcHRoTGVuZ3RoU2NhbGU7XHJcblxyXG4gICAgICAgICAgICB2YXIgaW50ZXJuYWxUaGlja25lc3MgPSBjdXJyZW50U2VnbWVudC5UaGlja25lc3MgKiBHcm93dGhGYWN0b3IgKiBFYXNlVGhpY2tuZXNzKEdyb3d0aEZhY3RvcikgKiBkZXB0aExlbmd0aFNjYWxlO1xyXG5cclxuICAgICAgICAgICAgaWYgKGludGVybmFsVGhpY2tuZXNzIDwgVGhpY2tuZXNzTGltaXQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGludGVybmFsVGhpY2tuZXNzID4gTGVhZkxpbWl0KVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAvLyBicmFuY2hcclxuICAgICAgICAgICAgICAgIGN0eC5TdHJva2VTdHlsZSA9IEJyYW5jaENvbG9yO1xyXG4gICAgICAgICAgICAgICAgY3R4LkZpbGxTdHlsZSA9IEJyYW5jaENvbG9yO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgLy8gbGVhZlxyXG4gICAgICAgICAgICAgICAgY3R4LlN0cm9rZVN0eWxlID0gXCIjMjA2NDExXCI7XHJcbiAgICAgICAgICAgICAgICBjdHguRmlsbFN0eWxlID0gXCIjMjA2NDExXCI7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChkb3VibGUuSXNOYU4obGFzdFRoaWNrbmVzcykpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGxhc3RUaGlja25lc3MgPSBpbnRlcm5hbFRoaWNrbmVzcztcclxuICAgICAgICAgICAgfVxyXG5CcmlkZ2UuU2NyaXB0LkRlY29uc3RydWN0KERyYXdTZWdtZW50VG9DYW52YXMyKHgsIHksIGludGVybmFsVGhpY2tuZXNzLCBjdXJyZW50QnJhbmNoQWJzb2x1dGVBbmdsZSwgbGFzdFRoaWNrbmVzcywgbGFzdEJyYW5jaEFic29sdXRlQW5nbGUsIGxlbmd0aCksIG91dCB4LCBvdXQgeSk7XHJcblxyXG4gICAgICAgICAgICBmb3JlYWNoICh2YXIgYnJhbmNoIGluIGN1cnJlbnRTZWdtZW50LkJyYW5jaGVzKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBEcmF3U2VnbWVudEludGVybmFsKGJyYW5jaCwgeCwgeSwgY3VycmVudEJyYW5jaEFic29sdXRlQW5nbGUsIGludGVybmFsVGhpY2tuZXNzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBTeXN0ZW0uVmFsdWVUdXBsZTxkb3VibGUgLGRvdWJsZSA+IERyYXdTZWdtZW50VG9DYW52YXMoXHJcbiAgICAgICAgICAgIGRvdWJsZSB4LFxyXG4gICAgICAgICAgICBkb3VibGUgeSxcclxuICAgICAgICAgICAgZG91YmxlIHRoaWNrbmVzcyxcclxuICAgICAgICAgICAgZG91YmxlIGFic29sdXRlQW5nbGUsXHJcbiAgICAgICAgICAgIGRvdWJsZSBwcmV2aW91c1RoaWNrbmVzcyxcclxuICAgICAgICAgICAgZG91YmxlIHByZXZpb3VzQW5nbGUsXHJcbiAgICAgICAgICAgIGRvdWJsZSBsZW5ndGhcclxuICAgICAgICApXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjdHguQmVnaW5QYXRoKCk7XHJcbiAgICAgICAgICAgIGN0eC5Nb3ZlVG8oeCwgeSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgZHggPSBNYXRoLkNvcyhhYnNvbHV0ZUFuZ2xlKSAqIGxlbmd0aCAqIFNjYWxlRmFjdG9yO1xyXG4gICAgICAgICAgICB2YXIgZHkgPSBNYXRoLlNpbihhYnNvbHV0ZUFuZ2xlKSAqIGxlbmd0aCAqIFNjYWxlRmFjdG9yO1xyXG5cclxuICAgICAgICAgICAgeCArPSBkeDtcclxuICAgICAgICAgICAgeSArPSAtZHk7XHJcblxyXG4gICAgICAgICAgICBjdHguTGluZVRvKHgsIHkpO1xyXG4gICAgICAgICAgICBjdHguTGluZVdpZHRoID0gdGhpY2tuZXNzICogU2NhbGVGYWN0b3I7XHJcbiAgICAgICAgICAgIGN0eC5DbG9zZVBhdGgoKTtcclxuXHJcbiAgICAgICAgICAgIGN0eC5TdHJva2UoKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgU3lzdGVtLlZhbHVlVHVwbGU8ZG91YmxlLCBkb3VibGU+KHgsIHkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBTeXN0ZW0uVmFsdWVUdXBsZTxkb3VibGUgLGRvdWJsZSA+IERyYXdTZWdtZW50VG9DYW52YXMyKFxyXG4gICAgICAgICAgICBkb3VibGUgeCxcclxuICAgICAgICAgICAgZG91YmxlIHksXHJcbiAgICAgICAgICAgIGRvdWJsZSB0aGlja25lc3MsXHJcbiAgICAgICAgICAgIGRvdWJsZSBhYnNvbHV0ZUFuZ2xlLFxyXG4gICAgICAgICAgICBkb3VibGUgcHJldmlvdXNUaGlja25lc3MsXHJcbiAgICAgICAgICAgIGRvdWJsZSBwcmV2aW91c0FuZ2xlLFxyXG4gICAgICAgICAgICBkb3VibGUgbGVuZ3RoXHJcbiAgICAgICAgKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIGR4ID0gTWF0aC5Db3MoYWJzb2x1dGVBbmdsZSkgKiBsZW5ndGggKiBTY2FsZUZhY3RvcjtcclxuICAgICAgICAgICAgdmFyIGR5ID0gTWF0aC5TaW4oYWJzb2x1dGVBbmdsZSkgKiBsZW5ndGggKiBTY2FsZUZhY3RvcjtcclxuXHJcbiAgICAgICAgICAgIHZhciBuZXdYID0geCArIGR4O1xyXG4gICAgICAgICAgICB2YXIgbmV3WSA9IHkgLSBkeTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlja25lc3MgPiBMZWFmTGltaXQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIC8vIGNhbGMgb2xkIGF0dGFjaHBvaW50c1xyXG4gICAgICAgICAgICAgICAgdmFyIG9sZE5vcm1hbCA9IHByZXZpb3VzQW5nbGUgLSBUQVUgKiAwLjI1O1xyXG4gICAgICAgICAgICAgICAgdmFyIG9sZE5vcm1hbFggPSBNYXRoLkNvcyhvbGROb3JtYWwpICogcHJldmlvdXNUaGlja25lc3MgLyAyO1xyXG4gICAgICAgICAgICAgICAgdmFyIG9sZE5vcm1hbFkgPSAtTWF0aC5TaW4ob2xkTm9ybWFsKSAqIHByZXZpb3VzVGhpY2tuZXNzIC8gMjtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBjYWxjIG5ldyBhdHRhY2hwb2ludHNcclxuICAgICAgICAgICAgICAgIHZhciBuZXdOb3JtYWwgPSBhYnNvbHV0ZUFuZ2xlICsgVEFVICogMC4yNTtcclxuICAgICAgICAgICAgICAgIHZhciBuZXdOb3JtYWxYID0gTWF0aC5Db3MobmV3Tm9ybWFsKSAqIHRoaWNrbmVzcyAvIDI7XHJcbiAgICAgICAgICAgICAgICB2YXIgbmV3Tm9ybWFsWSA9IC1NYXRoLlNpbihuZXdOb3JtYWwpICogdGhpY2tuZXNzIC8gMjtcclxuXHJcbiAgICAgICAgICAgICAgICBjdHguQmVnaW5QYXRoKCk7XHJcbiAgICAgICAgICAgICAgICBjdHguTW92ZVRvKHggKyBvbGROb3JtYWxYICogU2NhbGVGYWN0b3IsIHkgKyBvbGROb3JtYWxZICogU2NhbGVGYWN0b3IpO1xyXG4gICAgICAgICAgICAgICAgY3R4LkxpbmVUbyhuZXdYIC0gbmV3Tm9ybWFsWCAqIFNjYWxlRmFjdG9yLCBuZXdZIC0gbmV3Tm9ybWFsWSAqIFNjYWxlRmFjdG9yKTtcclxuICAgICAgICAgICAgICAgIGN0eC5MaW5lVG8obmV3WCArIG5ld05vcm1hbFggKiBTY2FsZUZhY3RvciwgbmV3WSArIG5ld05vcm1hbFkgKiBTY2FsZUZhY3Rvcik7XHJcbiAgICAgICAgICAgICAgICBjdHguTGluZVRvKHggLSBvbGROb3JtYWxYICogU2NhbGVGYWN0b3IsIHkgLSBvbGROb3JtYWxZICogU2NhbGVGYWN0b3IpO1xyXG5cclxuICAgICAgICAgICAgICAgIGN0eC5DbG9zZVBhdGgoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvL2N0eC5TdHJva2UoKTtcclxuICAgICAgICAgICAgICAgIGN0eC5GaWxsKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgY3R4LkJlZ2luUGF0aCgpO1xyXG4gICAgICAgICAgICAgICAgY3R4LkFyYyhuZXdYLCBuZXdZLCB0aGlja25lc3MgLyAyICogU2NhbGVGYWN0b3IsIDAsIFRBVSk7XHJcbiAgICAgICAgICAgICAgICBjdHguQ2xvc2VQYXRoKCk7XHJcbiAgICAgICAgICAgICAgICBjdHguRmlsbCgpO1xyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGN0eC5CZWdpblBhdGgoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBjdHguTW92ZVRvKHgsIHkpO1xyXG4gICAgICAgICAgICAgICAgY3R4LkxpbmVUbyhuZXdYLCBuZXdZKTtcclxuICAgICAgICAgICAgICAgIGN0eC5MaW5lV2lkdGggPSB0aGlja25lc3MgKiBTY2FsZUZhY3RvcjtcclxuXHJcbiAgICAgICAgICAgICAgICBjdHguQ2xvc2VQYXRoKCk7XHJcbiAgICAgICAgICAgICAgICBjdHguU3Ryb2tlKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgU3lzdGVtLlZhbHVlVHVwbGU8ZG91YmxlLCBkb3VibGU+KG5ld1gsIG5ld1kpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJuYW1lc3BhY2UgV2lzY2hpLkxENDYuS2VlcEl0QWxpdmUuQnJpZGdlTmV0XHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBUcmVlRW52aXJvbm1lbnRDb25maWdcclxuXHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIFRyZWVFbnZpcm9ubWVudENvbmZpZyhcclxuICAgICAgICAgICAgZG91YmxlIG1heEdyb3d0aFJhdGUsXHJcbiAgICAgICAgICAgIGRvdWJsZSBtaW5XYXRlclJhdGUsXHJcbiAgICAgICAgICAgIGRvdWJsZSBtYXhXYXRlclJhdGUsXHJcbiAgICAgICAgICAgIGRvdWJsZSBoZWFsUmF0ZSxcclxuICAgICAgICAgICAgZG91YmxlIGhhcm1SYXRlLFxyXG4gICAgICAgICAgICBkb3VibGUgaW5pdGlhbFdhdGVyTGV2ZWwsXHJcbiAgICAgICAgICAgIGludCBtc1JlZnJlc2hSYXRlLFxyXG4gICAgICAgICAgICBpbnQgbXNUaWNrUmF0ZSxcclxuICAgICAgICAgICAgaW50IG1zQXV0b1NhdmUsXHJcbiAgICAgICAgICAgIHN0cmluZyBzZXR0aW5nUHJlZml4XHJcbiAgICAgICAgKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgTWF4R3Jvd3RoUmF0ZSA9IG1heEdyb3d0aFJhdGU7XHJcbiAgICAgICAgICAgIE1pbldhdGVyUmF0ZSA9IG1pbldhdGVyUmF0ZTtcclxuICAgICAgICAgICAgTWF4V2F0ZXJSYXRlID0gbWF4V2F0ZXJSYXRlO1xyXG4gICAgICAgICAgICBIZWFsUmF0ZSA9IGhlYWxSYXRlO1xyXG4gICAgICAgICAgICBIYXJtUmF0ZSA9IGhhcm1SYXRlO1xyXG4gICAgICAgICAgICBJbml0aWFsV2F0ZXJMZXZlbCA9IGluaXRpYWxXYXRlckxldmVsO1xyXG4gICAgICAgICAgICBNc1JlZnJlc2hSYXRlID0gbXNSZWZyZXNoUmF0ZTtcclxuICAgICAgICAgICAgTXNUaWNrUmF0ZSA9IG1zVGlja1JhdGU7XHJcbiAgICAgICAgICAgIE1zQXV0b1NhdmUgPSBtc0F1dG9TYXZlO1xyXG4gICAgICAgICAgICBTZXR0aW5nUHJlZml4ID0gc2V0dGluZ1ByZWZpeDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBkb3VibGUgTWF4R3Jvd3RoUmF0ZSB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIGRvdWJsZSBNaW5XYXRlclJhdGUgeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBkb3VibGUgTWF4V2F0ZXJSYXRlIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgZG91YmxlIEhlYWxSYXRlIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgZG91YmxlIEhhcm1SYXRlIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgZG91YmxlIEluaXRpYWxXYXRlckxldmVsIHsgZ2V0OyBwcml2YXRlIHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBpbnQgTXNSZWZyZXNoUmF0ZSB7IGdldDsgcHJpdmF0ZSBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgaW50IE1zVGlja1JhdGUgeyBnZXQ7IHByaXZhdGUgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIGludCBNc0F1dG9TYXZlIHsgZ2V0OyBwcml2YXRlIHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBzdHJpbmcgU2V0dGluZ1ByZWZpeCB7IGdldDsgcHJpdmF0ZSBzZXQ7IH1cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcblxyXG5uYW1lc3BhY2UgV2lzY2hpLkxENDYuS2VlcEl0QWxpdmUuQnJpZGdlTmV0XHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBUcmVlRW52aXJvbm1lbnRDb25maWdCdWlsZGVyXHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIFRpbWVTcGFuIEZ1bGxHcm93blRyZWUgeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBUaW1lU3BhbiBUaWNrUmF0ZSB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIFRpbWVTcGFuIFdhdGVyTWluIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgVGltZVNwYW4gV2F0ZXJNYXggeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBUaW1lU3BhbiBEdXJhdGlvblVudGlsRGVhZFdoZW5VbmhlYWx0aHkgeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBUaW1lU3BhbiBEdXJhdGlvblVudGlsRnVsbEhlYWx0aFdoZW5IZWFsdGh5IHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgVGltZVNwYW4gU2NyZWVuUmVmcmVzaFJhdGUgeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBkb3VibGUgSW5pdGlhbFdhdGVyTGV2ZWwgeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBzdHJpbmcgU2V0dGluZ1ByZWZpeCB7IGdldDsgc2V0OyB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBUcmVlRW52aXJvbm1lbnRDb25maWcgQnVpbGQoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBUcmVlRW52aXJvbm1lbnRDb25maWcoXHJcbiAgICAgICAgICAgICAgICBHZXRQZXJUaWNrVmFsdWUoRnVsbEdyb3duVHJlZSksXHJcbiAgICAgICAgICAgICAgICBHZXRQZXJUaWNrVmFsdWUoV2F0ZXJNaW4pLFxyXG4gICAgICAgICAgICAgICAgR2V0UGVyVGlja1ZhbHVlKFdhdGVyTWF4KSxcclxuICAgICAgICAgICAgICAgIEdldFBlclRpY2tWYWx1ZShEdXJhdGlvblVudGlsRnVsbEhlYWx0aFdoZW5IZWFsdGh5KSxcclxuICAgICAgICAgICAgICAgIEdldFBlclRpY2tWYWx1ZShEdXJhdGlvblVudGlsRGVhZFdoZW5VbmhlYWx0aHkpLFxyXG4gICAgICAgICAgICAgICAgSW5pdGlhbFdhdGVyTGV2ZWwsXHJcbiAgICAgICAgICAgICAgICAoaW50KU1hdGguUm91bmQoU2NyZWVuUmVmcmVzaFJhdGUuVG90YWxNaWxsaXNlY29uZHMpLFxyXG4gICAgICAgICAgICAgICAgKGludClNYXRoLlJvdW5kKFRpY2tSYXRlLlRvdGFsTWlsbGlzZWNvbmRzKSxcclxuICAgICAgICAgICAgICAgIDE1MDAwLFxyXG4gICAgICAgICAgICAgICAgU2V0dGluZ1ByZWZpeFxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBkb3VibGUgR2V0UGVyVGlja1ZhbHVlKFRpbWVTcGFuIHZhbHVlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuIDEuMCAvICh2YWx1ZS5Ub3RhbE1pbGxpc2Vjb25kcyAvIFRpY2tSYXRlLlRvdGFsTWlsbGlzZWNvbmRzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG5cclxubmFtZXNwYWNlIFdpc2NoaS5MRDQ2LktlZXBJdEFsaXZlLkJyaWRnZU5ldFxyXG57XHJcbiAgICBwdWJsaWMgc3RhdGljIGNsYXNzIFRyZWVFbnZpcm9ubWVudENvbmZpZ3NcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgc3RhdGljIFRyZWVFbnZpcm9ubWVudENvbmZpZyBEZWJ1ZyB7IGdldDsgcHJpdmF0ZSBzZXQ7IH1cclxuICAgICAgICAgICAgXHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgVHJlZUVudmlyb25tZW50Q29uZmlnIFJlbGVhc2UgeyBnZXQ7IHByaXZhdGUgc2V0OyB9XHJcbiAgICAgICAgICAgIFxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIFRyZWVFbnZpcm9ubWVudENvbmZpZyBOb25aZW5zTW9kZSB7IGdldDsgcHJpdmF0ZSBzZXQ7IH1cclxuICAgICAgICAgICAgXHJcblxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIFRyZWVFbnZpcm9ubWVudENvbmZpZyBMdWR1bURhcmU0NlRlc3QgeyBnZXQ7IHByaXZhdGUgc2V0OyB9XHJcbiAgICAgICAgICAgIFxyXG5cbiAgICBcbnByaXZhdGUgc3RhdGljIFRyZWVFbnZpcm9ubWVudENvbmZpZyBfX1Byb3BlcnR5X19Jbml0aWFsaXplcl9fRGVidWc9bmV3IFRyZWVFbnZpcm9ubWVudENvbmZpZ0J1aWxkZXIoKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBGdWxsR3Jvd25UcmVlID0gVGltZVNwYW4uRnJvbU1pbnV0ZXMoMTApLFxyXG4gICAgICAgICAgICAgICAgVGlja1JhdGUgPSBUaW1lU3Bhbi5Gcm9tTWlsbGlzZWNvbmRzKDEwKSxcclxuICAgICAgICAgICAgICAgIFdhdGVyTWF4ID0gVGltZVNwYW4uRnJvbVNlY29uZHMoMTYwKSxcclxuICAgICAgICAgICAgICAgIFdhdGVyTWluID0gVGltZVNwYW4uRnJvbVNlY29uZHMoNTApLFxyXG4gICAgICAgICAgICAgICAgU2NyZWVuUmVmcmVzaFJhdGUgPSBUaW1lU3Bhbi5Gcm9tTWlsbGlzZWNvbmRzKDEwMCksXHJcbiAgICAgICAgICAgICAgICBEdXJhdGlvblVudGlsRGVhZFdoZW5VbmhlYWx0aHkgPSBUaW1lU3Bhbi5Gcm9tU2Vjb25kcygxMDAwKSxcclxuICAgICAgICAgICAgICAgIER1cmF0aW9uVW50aWxGdWxsSGVhbHRoV2hlbkhlYWx0aHkgPSBUaW1lU3Bhbi5Gcm9tU2Vjb25kcygxMCksXHJcbiAgICAgICAgICAgICAgICBJbml0aWFsV2F0ZXJMZXZlbCA9IDEsXHJcbiAgICAgICAgICAgICAgICBTZXR0aW5nUHJlZml4ID0gXCJkZXZlbG9wXCJcclxuICAgICAgICAgICAgfS5CdWlsZCgpO3ByaXZhdGUgc3RhdGljIFRyZWVFbnZpcm9ubWVudENvbmZpZyBfX1Byb3BlcnR5X19Jbml0aWFsaXplcl9fUmVsZWFzZT1uZXcgVHJlZUVudmlyb25tZW50Q29uZmlnQnVpbGRlcigpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIEZ1bGxHcm93blRyZWUgPSBUaW1lU3Bhbi5Gcm9tRGF5cygzNjUgKiAyKSwgLy8gdHdvIHllYXJzXHJcbiAgICAgICAgICAgICAgICBUaWNrUmF0ZSA9IFRpbWVTcGFuLkZyb21NaW51dGVzKDE1KSxcclxuICAgICAgICAgICAgICAgIFdhdGVyTWF4ID0gVGltZVNwYW4uRnJvbURheXMoMTYpLFxyXG4gICAgICAgICAgICAgICAgV2F0ZXJNaW4gPSBUaW1lU3Bhbi5Gcm9tRGF5cyg1KSxcclxuICAgICAgICAgICAgICAgIFNjcmVlblJlZnJlc2hSYXRlID0gVGltZVNwYW4uRnJvbU1pbnV0ZXMoMSksXHJcbiAgICAgICAgICAgICAgICBEdXJhdGlvblVudGlsRGVhZFdoZW5VbmhlYWx0aHkgPSBUaW1lU3Bhbi5Gcm9tRGF5cygxNCksXHJcbiAgICAgICAgICAgICAgICBEdXJhdGlvblVudGlsRnVsbEhlYWx0aFdoZW5IZWFsdGh5ID0gVGltZVNwYW4uRnJvbURheXMoMTQpLFxyXG4gICAgICAgICAgICAgICAgSW5pdGlhbFdhdGVyTGV2ZWwgPSAwLjMsXHJcbiAgICAgICAgICAgICAgICBTZXR0aW5nUHJlZml4ID0gXCJib25zYWlcIlxyXG4gICAgICAgICAgICB9LkJ1aWxkKCk7cHJpdmF0ZSBzdGF0aWMgVHJlZUVudmlyb25tZW50Q29uZmlnIF9fUHJvcGVydHlfX0luaXRpYWxpemVyX19Ob25aZW5zTW9kZT1uZXcgVHJlZUVudmlyb25tZW50Q29uZmlnQnVpbGRlcigpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIEZ1bGxHcm93blRyZWUgPSBUaW1lU3Bhbi5Gcm9tTWludXRlcygxKSxcclxuICAgICAgICAgICAgICAgIFRpY2tSYXRlID0gVGltZVNwYW4uRnJvbU1pbGxpc2Vjb25kcygxMCksXHJcbiAgICAgICAgICAgICAgICBXYXRlck1heCA9IFRpbWVTcGFuLkZyb21TZWNvbmRzKDE2KSxcclxuICAgICAgICAgICAgICAgIFdhdGVyTWluID0gVGltZVNwYW4uRnJvbVNlY29uZHMoNSksXHJcbiAgICAgICAgICAgICAgICBTY3JlZW5SZWZyZXNoUmF0ZSA9IFRpbWVTcGFuLkZyb21NaWxsaXNlY29uZHMoMTAwKSxcclxuICAgICAgICAgICAgICAgIER1cmF0aW9uVW50aWxEZWFkV2hlblVuaGVhbHRoeSA9IFRpbWVTcGFuLkZyb21TZWNvbmRzKDEwKSxcclxuICAgICAgICAgICAgICAgIER1cmF0aW9uVW50aWxGdWxsSGVhbHRoV2hlbkhlYWx0aHkgPSBUaW1lU3Bhbi5Gcm9tU2Vjb25kcygxMCksXHJcbiAgICAgICAgICAgICAgICBJbml0aWFsV2F0ZXJMZXZlbCA9IDEsXHJcbiAgICAgICAgICAgICAgICBTZXR0aW5nUHJlZml4ID0gXCJkZWJ1Z1wiXHJcbiAgICAgICAgICAgIH0uQnVpbGQoKTtwcml2YXRlIHN0YXRpYyBUcmVlRW52aXJvbm1lbnRDb25maWcgX19Qcm9wZXJ0eV9fSW5pdGlhbGl6ZXJfX0x1ZHVtRGFyZTQ2VGVzdD1uZXcgVHJlZUVudmlyb25tZW50Q29uZmlnQnVpbGRlcigpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIEZ1bGxHcm93blRyZWUgPSBUaW1lU3Bhbi5Gcm9tSG91cnMoMiksXHJcbiAgICAgICAgICAgICAgICBUaWNrUmF0ZSA9IFRpbWVTcGFuLkZyb21NaWxsaXNlY29uZHMoMTAwKSxcclxuICAgICAgICAgICAgICAgIFNjcmVlblJlZnJlc2hSYXRlID0gVGltZVNwYW4uRnJvbU1pbGxpc2Vjb25kcygxMDAwKSxcclxuICAgICAgICAgICAgICAgIFdhdGVyTWF4ID0gVGltZVNwYW4uRnJvbU1pbnV0ZXMoMTUpLFxyXG4gICAgICAgICAgICAgICAgV2F0ZXJNaW4gPSBUaW1lU3Bhbi5Gcm9tTWludXRlcygzMCksXHJcbiAgICAgICAgICAgICAgICBEdXJhdGlvblVudGlsRGVhZFdoZW5VbmhlYWx0aHkgPSBUaW1lU3Bhbi5Gcm9tTWludXRlcygxNSksXHJcbiAgICAgICAgICAgICAgICBEdXJhdGlvblVudGlsRnVsbEhlYWx0aFdoZW5IZWFsdGh5ID0gVGltZVNwYW4uRnJvbU1pbnV0ZXMoMTUpLFxyXG4gICAgICAgICAgICAgICAgSW5pdGlhbFdhdGVyTGV2ZWwgPSAwLjMsXHJcbiAgICAgICAgICAgICAgICBTZXR0aW5nUHJlZml4ID0gXCJMRDQ2XCJcclxuICAgICAgICAgICAgfS5CdWlsZCgpO31cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcblxyXG5uYW1lc3BhY2UgV2lzY2hpLkxENDYuS2VlcEl0QWxpdmUuQnJpZGdlTmV0XHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBUcmVlU3RhdGVGYWN0b3J5XHJcbiAgICB7XHJcbiAgICAgICAgcHJpdmF0ZSByZWFkb25seSBSYW5kb20gcm5nO1xyXG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgSUNsb2NrIGNsb2NrO1xyXG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgVHJlZUVudmlyb25tZW50Q29uZmlnIHRyZWVFbnZpcm9ubWVudENvbmZpZztcclxuXHJcbiAgICAgICAgcHVibGljIFRyZWVTdGF0ZUZhY3RvcnkoXHJcbiAgICAgICAgICAgIFJhbmRvbSBybmcsXHJcbiAgICAgICAgICAgIElDbG9jayBjbG9jayxcclxuICAgICAgICAgICAgVHJlZUVudmlyb25tZW50Q29uZmlnIHRyZWVFbnZpcm9ubWVudENvbmZpZ1xyXG4gICAgICAgIClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMucm5nID0gcm5nID8/ICgoU3lzdGVtLkZ1bmM8UmFuZG9tPikoKCk9Pnt0aHJvdyBuZXcgQXJndW1lbnROdWxsRXhjZXB0aW9uKFwicm5nXCIpO30pKSgpO1xyXG4gICAgICAgICAgICB0aGlzLmNsb2NrID0gY2xvY2sgPz8gKChTeXN0ZW0uRnVuYzxJQ2xvY2s+KSgoKT0+e3Rocm93IG5ldyBBcmd1bWVudE51bGxFeGNlcHRpb24oXCJjbG9ja1wiKTt9KSkoKTtcclxuICAgICAgICAgICAgdGhpcy50cmVlRW52aXJvbm1lbnRDb25maWcgPSB0cmVlRW52aXJvbm1lbnRDb25maWcgPz8gKChTeXN0ZW0uRnVuYzxUcmVlRW52aXJvbm1lbnRDb25maWc+KSgoKT0+e3Rocm93IG5ldyBBcmd1bWVudE51bGxFeGNlcHRpb24oXCJ0cmVlRW52aXJvbm1lbnRDb25maWdcIik7fSkpKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgVHJlZVN0YXRlIENyZWF0ZVRyZWUoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIG5vdyA9IGNsb2NrLk5vdygpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBUcmVlU3RhdGUoKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBTZWVkID0gcm5nLk5leHQoKSxcclxuICAgICAgICAgICAgICAgIFRpY2tzID0gMCxcclxuICAgICAgICAgICAgICAgIEdyb3d0aCA9IDAsXHJcbiAgICAgICAgICAgICAgICBIZWFsdGggPSAxLFxyXG4gICAgICAgICAgICAgICAgU3RhcnRUaW1lc3RhbXAgPSBub3csXHJcbiAgICAgICAgICAgICAgICBXYXRlckxldmVsID0gdHJlZUVudmlyb25tZW50Q29uZmlnLkluaXRpYWxXYXRlckxldmVsLFxyXG4gICAgICAgICAgICAgICAgTGFzdEV2ZW50VGltZXN0YW1wID0gbm93LFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJuYW1lc3BhY2UgV2lzY2hpLkxENDYuS2VlcEl0QWxpdmVcclxue1xyXG4gICAgcHVibGljIHN0YXRpYyBjbGFzcyBSYW5kb21FeHRlbnNpb25zXHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBkb3VibGUgVW5pZm9ybVJhbmRvbSh0aGlzIElSYW5kb21Tb3VyY2UgcmFuZG9tU291cmNlLCBkb3VibGUgbG93ZXJMaW1pdCwgZG91YmxlIHVwcGVyTGltaXQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgZGVsdGEgPSAodXBwZXJMaW1pdCAtIGxvd2VyTGltaXQpO1xyXG4gICAgICAgICAgICB2YXIgcmFuZEFtb3VudCA9IHJhbmRvbVNvdXJjZS5OZXh0RG91YmxlKCkgKiBkZWx0YTtcclxuICAgICAgICAgICAgcmV0dXJuIGxvd2VyTGltaXQgKyByYW5kQW1vdW50O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcblxyXG5uYW1lc3BhY2UgV2lzY2hpLkxENDYuS2VlcEl0QWxpdmVcclxue1xyXG4gICAgcHVibGljIGNsYXNzIFRyZWVCdWlsZGVyXHJcbiAgICB7XHJcbiAgICAgICAgcHJpdmF0ZSBjb25zdCBkb3VibGUgVEFVID0gNi4yODMxODUzMDcxNzk1ODYyO1xyXG5cclxuICAgICAgICBwcml2YXRlIHJlYWRvbmx5IElSYW5kb21Tb3VyY2UgcmFuZG9tO1xyXG5cclxuICAgICAgICBwdWJsaWMgVHJlZUJ1aWxkZXIoSVJhbmRvbVNvdXJjZSByYW5kb20pXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLnJhbmRvbSA9IHJhbmRvbSA/PyAoKFN5c3RlbS5GdW5jPElSYW5kb21Tb3VyY2U+KSgoKT0+e3Rocm93IG5ldyBBcmd1bWVudE51bGxFeGNlcHRpb24oXCJyYW5kb21cIik7fSkpKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgZG91YmxlIFRydW5rVGhpY2tuZXNzIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgZG91YmxlIFByb2JhYmlsaXR5U2luZ2xlQnJhbmNoIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgZG91YmxlIEJyYW5jaFRoaWNrbmVzc1JlZHVjdGlvbkZhY3RvciB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIGRvdWJsZSBCcmFuY2hMZW5ndGhSZWR1Y3Rpb25GYWN0b3JNaW4geyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBkb3VibGUgQnJhbmNoTGVuZ3RoUmVkdWN0aW9uRmFjdG9yTWF4IHsgZ2V0OyBzZXQ7IH1cclxuXHJcbiAgICAgICAgcHVibGljIGRvdWJsZSBNYXhSb3RhdGlvbkZhY3RvciB7IGdldDsgc2V0OyB9IFxyXG4gICAgICAgIHB1YmxpYyBkb3VibGUgQnJhbmNoU3ByZWFkTWluIHsgZ2V0OyBzZXQ7IH0gXHJcbiAgICAgICAgcHVibGljIGRvdWJsZSBCcmFuY2hTcHJlYWRNYXggeyBnZXQ7IHNldDsgfSBcclxuXHJcblxyXG4gICAgICAgIHB1YmxpYyBpbnQgTWF4RGVwdGggeyBnZXQ7IHNldDsgfVxyXG5cclxuICAgICAgICBwdWJsaWMgVHJlZVNlZ21lbnQgQnVpbGRUcmVlKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciB0cnVuayA9IG5ldyBUcmVlU2VnbWVudChUcnVua1RoaWNrbmVzcyk7XHJcbiAgICAgICAgICAgIEFkZEJyYW5jaGVzVG9TZWdtZW50KHRydW5rLCAwLjI1ICogVEFVKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRydW5rO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSB2b2lkIEFkZEJyYW5jaGVzVG9TZWdtZW50KFRyZWVTZWdtZW50IHNlZ21lbnQsIGRvdWJsZSBhYnNvbHV0ZUFuZ2xlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKHNlZ21lbnQuRGVwdGggPT0gTWF4RGVwdGgpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHNlZ21lbnQuVGhpY2tuZXNzIDwgMC4wMDIpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc3QgZG91YmxlIG1heERldkFuZ2xlID0gMC4xICogVEFVO1xyXG4gICAgICAgICAgICBjb25zdCBkb3VibGUgZ3Jhdml0eU5vcm1hbCA9IDAuNzUgKiBUQVU7XHJcblxyXG4gICAgICAgICAgICB2YXIgZGVsdGFBbmdsZSA9IE1hdGguQXRhbjIoTWF0aC5TaW4oZ3Jhdml0eU5vcm1hbCAtIGFic29sdXRlQW5nbGUpLCBNYXRoLkNvcyhncmF2aXR5Tm9ybWFsIC0gYWJzb2x1dGVBbmdsZSkpO1xyXG5cclxuICAgICAgICAgICAgaWYgKE1hdGguQWJzKGRlbHRhQW5nbGUpIDwgbWF4RGV2QW5nbGUpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyIHJhbmRvbURldmlhdGlvbkFuZ2xlID0gcmFuZG9tLk5leHREb3VibGUoKSAqIDIgKiBNYXhSb3RhdGlvbkZhY3RvciAtIE1heFJvdGF0aW9uRmFjdG9yO1xyXG4gICAgICAgICAgICB2YXIgZGV2aWF0aW9uQW5nbGUgPSBCaWFzZWRWYWx1ZSgwLCByYW5kb21EZXZpYXRpb25BbmdsZSwgMSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgYnJhbmNoaW5nU3ByZWFkID0gcmFuZG9tLlVuaWZvcm1SYW5kb20oQnJhbmNoU3ByZWFkTWluLCBCcmFuY2hTcHJlYWRNYXgpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHNlZ21lbnQuRGVwdGggPT0gMClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgQWRkQW5nbGVkQnJhbmNoKHNlZ21lbnQsIGRldmlhdGlvbkFuZ2xlIC0gYnJhbmNoaW5nU3ByZWFkIC8gMiwgYWJzb2x1dGVBbmdsZSk7XHJcbiAgICAgICAgICAgICAgICBBZGRBbmdsZWRCcmFuY2goc2VnbWVudCwgZGV2aWF0aW9uQW5nbGUgKyBicmFuY2hpbmdTcHJlYWQgLyAyLCBhYnNvbHV0ZUFuZ2xlKTtcclxuICAgICAgICAgICAgICAgIEFkZEFuZ2xlZEJyYW5jaChzZWdtZW50LCBkZXZpYXRpb25BbmdsZSwgYWJzb2x1dGVBbmdsZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAocmFuZG9tLk5leHREb3VibGUoKSA8PSBQcm9iYWJpbGl0eVNpbmdsZUJyYW5jaClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgLy8gbm8gYnJhbmNoaW5nXHJcbiAgICAgICAgICAgICAgICBBZGRBbmdsZWRCcmFuY2goc2VnbWVudCwgZGV2aWF0aW9uQW5nbGUsIGFic29sdXRlQW5nbGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgLy8gYnJhbmNoaW5nXHJcbiAgICAgICAgICAgICAgICB2YXIgbGVmdEFuZ2xlID0gZGV2aWF0aW9uQW5nbGUgLSBicmFuY2hpbmdTcHJlYWQgLyAyO1xyXG4gICAgICAgICAgICAgICAgdmFyIHJpZ2h0QW5nbGUgPSBkZXZpYXRpb25BbmdsZSArIGJyYW5jaGluZ1NwcmVhZCAvIDI7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHJhbmRvbS5OZXh0RG91YmxlKCkgPCAwLjgpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJuZEFuZ2xlID0gcmFuZG9tLlVuaWZvcm1SYW5kb20oZGV2aWF0aW9uQW5nbGUgLSBicmFuY2hpbmdTcHJlYWQsIGRldmlhdGlvbkFuZ2xlICsgYnJhbmNoaW5nU3ByZWFkKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgdGhpY2tuZXNzID0gcmFuZG9tLlVuaWZvcm1SYW5kb20oMC4yNSwgMC41KTtcclxuICAgICAgICAgICAgICAgICAgICBBZGRBbmdsZWRCcmFuY2goc2VnbWVudCwgcm5kQW5nbGUsIGFic29sdXRlQW5nbGUsIGV4dHJhVGhpY2tuZXNzRmFjdG9yOiB0aGlja25lc3MpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIEFkZEFuZ2xlZEJyYW5jaChzZWdtZW50LCBsZWZ0QW5nbGUsIGFic29sdXRlQW5nbGUpO1xyXG4gICAgICAgICAgICAgICAgQWRkQW5nbGVkQnJhbmNoKHNlZ21lbnQsIHJpZ2h0QW5nbGUsIGFic29sdXRlQW5nbGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIGRvdWJsZSBCaWFzZWRWYWx1ZShkb3VibGUgdmFsdWVBLCBkb3VibGUgdmFsdWVCLCBkb3VibGUgYmlhcylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZUIgKiBiaWFzICsgdmFsdWVBICogKDEgLSBiaWFzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgdm9pZCBBZGRBbmdsZWRCcmFuY2goVHJlZVNlZ21lbnQgcGFyZW50LCBkb3VibGUgZGV2aWF0aW9uLCBkb3VibGUgb2xkQWJzb2x1dGVBbmdsZSwgZG91YmxlIGV4dHJhVGhpY2tuZXNzRmFjdG9yID0gMSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBsZW5ndGhGYWN0b3IgPSAwLjg7XHJcblxyXG4gICAgICAgICAgICBpZiAocGFyZW50LkRlcHRoIDwgMylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbGVuZ3RoRmFjdG9yID0gcmFuZG9tLlVuaWZvcm1SYW5kb20oQnJhbmNoTGVuZ3RoUmVkdWN0aW9uRmFjdG9yTWluLCBCcmFuY2hMZW5ndGhSZWR1Y3Rpb25GYWN0b3JNYXgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YXIgbmV4dFRoaW5ja25lc3MgPSBwYXJlbnQuVGhpY2tuZXNzICogQnJhbmNoVGhpY2tuZXNzUmVkdWN0aW9uRmFjdG9yICogZXh0cmFUaGlja25lc3NGYWN0b3I7XHJcblxyXG4gICAgICAgICAgICB2YXIgYnJhbmNoID0gcGFyZW50LkFkZEJyYW5jaChkZXZpYXRpb24sIHBhcmVudC5MZW5ndGggKiBsZW5ndGhGYWN0b3IsIG5leHRUaGluY2tuZXNzKTtcclxuICAgICAgICAgICAgQWRkQnJhbmNoZXNUb1NlZ21lbnQoYnJhbmNoLCBvbGRBYnNvbHV0ZUFuZ2xlICsgZGV2aWF0aW9uKTtcclxuICAgICAgICB9XHJcblxuICAgIFxucHJpdmF0ZSBkb3VibGUgX19Qcm9wZXJ0eV9fSW5pdGlhbGl6ZXJfX1RydW5rVGhpY2tuZXNzPTAuMztwcml2YXRlIGRvdWJsZSBfX1Byb3BlcnR5X19Jbml0aWFsaXplcl9fUHJvYmFiaWxpdHlTaW5nbGVCcmFuY2g9MC4xO3ByaXZhdGUgZG91YmxlIF9fUHJvcGVydHlfX0luaXRpYWxpemVyX19CcmFuY2hUaGlja25lc3NSZWR1Y3Rpb25GYWN0b3I9MC43O3ByaXZhdGUgZG91YmxlIF9fUHJvcGVydHlfX0luaXRpYWxpemVyX19CcmFuY2hMZW5ndGhSZWR1Y3Rpb25GYWN0b3JNaW49MC42O3ByaXZhdGUgZG91YmxlIF9fUHJvcGVydHlfX0luaXRpYWxpemVyX19CcmFuY2hMZW5ndGhSZWR1Y3Rpb25GYWN0b3JNYXg9MC44NTtwcml2YXRlIGRvdWJsZSBfX1Byb3BlcnR5X19Jbml0aWFsaXplcl9fTWF4Um90YXRpb25GYWN0b3I9MC4zMTQxNTkyNjUzNTg5NzkzMTtwcml2YXRlIGRvdWJsZSBfX1Byb3BlcnR5X19Jbml0aWFsaXplcl9fQnJhbmNoU3ByZWFkTWluPTAuNjI4MzE4NTMwNzE3OTU4NjI7cHJpdmF0ZSBkb3VibGUgX19Qcm9wZXJ0eV9fSW5pdGlhbGl6ZXJfX0JyYW5jaFNwcmVhZE1heD0xLjI1NjYzNzA2MTQzNTkxNzM7cHJpdmF0ZSBpbnQgX19Qcm9wZXJ0eV9fSW5pdGlhbGl6ZXJfX01heERlcHRoPTEyO31cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcclxuXHJcbm5hbWVzcGFjZSBXaXNjaGkuTEQ0Ni5LZWVwSXRBbGl2ZVxyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgVHJlZVNlZ21lbnRcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgVHJlZVNlZ21lbnQoZG91YmxlIHRoaWNrbmVzcylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIERlcHRoID0gMDtcclxuICAgICAgICAgICAgRGV2aWF0aW9uQW5nbGUgPSAwO1xyXG4gICAgICAgICAgICBMZW5ndGggPSAxO1xyXG5cclxuICAgICAgICAgICAgQnJhbmNoZXMgPSBuZXcgTGlzdDxUcmVlU2VnbWVudD4oKTtcclxuICAgICAgICAgICAgVGhpY2tuZXNzID0gdGhpY2tuZXNzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBUcmVlU2VnbWVudChpbnQgZGVwdGgsIGRvdWJsZSBkZXZpYXRpb25BbmdsZSwgZG91YmxlIGxlbmd0aCwgZG91YmxlIHRoaWNrbmVzcylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIERlcHRoID0gZGVwdGg7XHJcbiAgICAgICAgICAgIERldmlhdGlvbkFuZ2xlID0gZGV2aWF0aW9uQW5nbGU7XHJcbiAgICAgICAgICAgIExlbmd0aCA9IGxlbmd0aDtcclxuICAgICAgICAgICAgVGhpY2tuZXNzID0gdGhpY2tuZXNzO1xyXG4gICAgICAgICAgICBCcmFuY2hlcyA9IG5ldyBMaXN0PFRyZWVTZWdtZW50PigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIGludCBEZXB0aCB7IGdldDsgcHJpdmF0ZSBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgZG91YmxlIFRoaWNrbmVzcyB7IGdldDsgcHJpdmF0ZSBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgZG91YmxlIERldmlhdGlvbkFuZ2xlIHsgZ2V0OyBwcml2YXRlIHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBkb3VibGUgTGVuZ3RoIHsgZ2V0OyBwcml2YXRlIHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBJTGlzdDxUcmVlU2VnbWVudD4gQnJhbmNoZXMgeyBnZXQ7IHByaXZhdGUgc2V0OyB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBUcmVlU2VnbWVudCBBZGRCcmFuY2goZG91YmxlIGRldmlhdGlvbkFuZ2xlLCBkb3VibGUgbGVuZ3RoLCBkb3VibGUgdGhpY2tuZXNzKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIGJyYW5jaCA9IG5ldyBUcmVlU2VnbWVudChEZXB0aCArIDEsIGRldmlhdGlvbkFuZ2xlLCBsZW5ndGgsIHRoaWNrbmVzcyk7XHJcbiAgICAgICAgICAgIEJyYW5jaGVzLkFkZChicmFuY2gpO1xyXG4gICAgICAgICAgICByZXR1cm4gYnJhbmNoO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcblxyXG5uYW1lc3BhY2UgV2lzY2hpLkxENDYuS2VlcEl0QWxpdmVcclxue1xyXG4gICAgcHVibGljIHN0cnVjdCBWZWN0b3IyRFxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBWZWN0b3IyRChkb3VibGUgeCwgZG91YmxlIHkpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBYID0geDtcclxuICAgICAgICAgICAgWSA9IHk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgZG91YmxlIFggeyBnZXQ7IHByaXZhdGUgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIGRvdWJsZSBZIHsgZ2V0OyBwcml2YXRlIHNldDsgfVxyXG5wdWJsaWMgZG91YmxlIExlbmd0aFxyXG57XHJcbiAgICBnZXRcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gTWF0aC5TcXJ0KFggKiBYICsgWSAqIFkpO1xyXG4gICAgfVxyXG59XHJcbiAgICAgICAgcHVibGljIFZlY3RvcjJEIFJvdGF0ZShkb3VibGUgcmFkaWFuQW5nbGUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgY29zQW5nbGUgPSBNYXRoLkNvcyhyYWRpYW5BbmdsZSk7XHJcbiAgICAgICAgICAgIHZhciBzaW5BbmdsZSA9IE1hdGguU2luKHJhZGlhbkFuZ2xlKTtcclxuXHJcbiAgICAgICAgICAgIHZhciB4ID0gY29zQW5nbGUgKiBYIC0gc2luQW5nbGUgKiBZO1xyXG4gICAgICAgICAgICB2YXIgeSA9IHNpbkFuZ2xlICogWCArIGNvc0FuZ2xlICogWTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgVmVjdG9yMkQoeCwgeSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgVmVjdG9yMkQgQ2hhbmdlTGVuZ3RoKGRvdWJsZSBuZXdMZW5ndGgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgbGVuID0gTGVuZ3RoO1xyXG5cclxuICAgICAgICAgICAgdmFyIG5vcm1hbGl6ZWRYID0gWCAvIGxlbjtcclxuICAgICAgICAgICAgdmFyIG5vcm1hbGl6ZWRZID0gWSAvIGxlbjtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgVmVjdG9yMkQobm9ybWFsaXplZFggKiBuZXdMZW5ndGgsIG5vcm1hbGl6ZWRZICogbmV3TGVuZ3RoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgQnJpZGdlLkh0bWw1O1xyXG5cclxubmFtZXNwYWNlIFdpc2NoaS5MRDQ2LktlZXBJdEFsaXZlLkJyaWRnZU5ldFxyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgQnJpZGdlQ2xvY2sgOiBJQ2xvY2tcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgZG91YmxlIE5vdygpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gRGF0ZS5Ob3coKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgQnJpZGdlLkh0bWw1O1xyXG5cclxubmFtZXNwYWNlIFdpc2NoaS5MRDQ2LktlZXBJdEFsaXZlLkJyaWRnZU5ldFxyXG57XHJcbiAgICAvLy8gPHN1bW1hcnk+XHJcbiAgICAvLy8gVGhpcyBzdG9yYWdlIGlzIGxlZ2FjeSAoc2luY2UgMjIuMDIuMjAyMCkgYW5kIHdpbGwgYmUgcmVtb3ZlZCBsYXRlci5cclxuICAgIC8vLyA8L3N1bW1hcnk+XHJcbiAgICAvLy8gPHJlbWFya3M+XHJcbiAgICAvLy8gVGhpcyBzdG9yZSBpcyBzdGlsbCBtYWludGFpbmVkLCB1bnRpbCBhbGwgdGhlIHRyZWVzIHRoYXQgYXJlIG5vdCB1cGRhdGVkLCBhcmUgZGVhZCBhbnl3YXlzLlxyXG4gICAgLy8vIDwvcmVtYXJrcz5cclxuICAgIHB1YmxpYyBjbGFzcyBMb2NhbFN0b3JhZ2VMZWdhY3lUcmVlU3RhdGVTdG9yZSA6IElUcmVlU3RhdGVTdG9yZVxyXG4gICAge1xyXG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgc3RyaW5nIHNlZWRLZXk7XHJcbiAgICAgICAgcHJpdmF0ZSByZWFkb25seSBzdHJpbmcgdGlja0tleTtcclxuICAgICAgICBwcml2YXRlIHJlYWRvbmx5IHN0cmluZyBzdGFydEtleTtcclxuICAgICAgICBwcml2YXRlIHJlYWRvbmx5IHN0cmluZyBncm93dGhLZXk7XHJcbiAgICAgICAgcHJpdmF0ZSByZWFkb25seSBzdHJpbmcgaGVhbHRoS2V5O1xyXG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgc3RyaW5nIGxhc3RVcGRhdGVLZXk7XHJcbiAgICAgICAgcHJpdmF0ZSByZWFkb25seSBzdHJpbmcgd2F0ZXJMZXZlbEtleTtcclxuXHJcbiAgICAgICAgcHVibGljIExvY2FsU3RvcmFnZUxlZ2FjeVRyZWVTdGF0ZVN0b3JlKHN0cmluZyBwcmVmaXgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzZWVkS2V5ID0gcHJlZml4ICsgXCIuU2VlZFwiO1xyXG4gICAgICAgICAgICB0aWNrS2V5ID0gcHJlZml4ICsgXCIuVGlja3NcIjtcclxuICAgICAgICAgICAgc3RhcnRLZXkgPSBwcmVmaXggKyBcIi5TdGFydFwiO1xyXG4gICAgICAgICAgICBncm93dGhLZXkgPSBwcmVmaXggKyBcIi5Hcm93dGhcIjtcclxuICAgICAgICAgICAgaGVhbHRoS2V5ID0gcHJlZml4ICsgXCIuSGVhbHRoXCI7XHJcbiAgICAgICAgICAgIGxhc3RVcGRhdGVLZXkgPSBwcmVmaXggKyBcIi5MYXN0VXBkYXRlXCI7XHJcbiAgICAgICAgICAgIHdhdGVyTGV2ZWxLZXkgPSBwcmVmaXggKyBcIi5XYXRlckxldmVsXCI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgVHJlZVN0YXRlIEdldCgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgc2VlZFZhbHVlID0gV2luZG93LkxvY2FsU3RvcmFnZS5HZXRJdGVtKHNlZWRLZXkpIGFzIHN0cmluZztcclxuICAgICAgICAgICAgdmFyIHRpY2tWYWx1ZSA9IFdpbmRvdy5Mb2NhbFN0b3JhZ2UuR2V0SXRlbSh0aWNrS2V5KSBhcyBzdHJpbmc7XHJcbiAgICAgICAgICAgIHZhciBzdGFydFZhbHVlID0gV2luZG93LkxvY2FsU3RvcmFnZS5HZXRJdGVtKHN0YXJ0S2V5KSBhcyBzdHJpbmc7XHJcbiAgICAgICAgICAgIHZhciBncm93dGhWYWx1ZSA9IFdpbmRvdy5Mb2NhbFN0b3JhZ2UuR2V0SXRlbShncm93dGhLZXkpIGFzIHN0cmluZztcclxuICAgICAgICAgICAgdmFyIGhlYWx0aFZhbHVlID0gV2luZG93LkxvY2FsU3RvcmFnZS5HZXRJdGVtKGhlYWx0aEtleSkgYXMgc3RyaW5nO1xyXG4gICAgICAgICAgICB2YXIgd2F0ZXJMZXZlbFZhbHVlID0gV2luZG93LkxvY2FsU3RvcmFnZS5HZXRJdGVtKHdhdGVyTGV2ZWxLZXkpIGFzIHN0cmluZztcclxuICAgICAgICAgICAgdmFyIGxhc3RVcGRhdGVWYWx1ZSA9IFdpbmRvdy5Mb2NhbFN0b3JhZ2UuR2V0SXRlbShsYXN0VXBkYXRlS2V5KSBhcyBzdHJpbmc7XHJcbmludCBzZWVkO1xuaW50IHRpY2s7XG5kb3VibGUgc3RhcnQ7XG5kb3VibGUgZ3Jvd3RoO1xuZG91YmxlIGhlYWx0aDtcbmRvdWJsZSBsYXN0VXBkYXRlO1xuZG91YmxlIHdhdGVyTGV2ZWw7XG5cclxuICAgICAgICAgICAgLy8gVXNlIHNpbmdsZSAmIHRvIGZvcmNlIHBhcnNlIGFsbCB2YWx1ZXMgZXZlbiBpZiB0aGUgZmlyc3Qgb25lIGZhaWxlZC5cclxuICAgICAgICAgICAgLy8gV2UgZG8gdGhpcyB0byBwcmV2ZW50IGEgQ1MwMTY1IHVuaW5pdGlhbGl6ZWQgZXJyb3IuXHJcblxyXG4gICAgICAgICAgICB2YXIgcGFyc2VTdWNjZXNzID1cclxuICAgICAgICAgICAgICAgIGludC5UcnlQYXJzZShzZWVkVmFsdWUsIG91dCBzZWVkKSAmXHJcbiAgICAgICAgICAgICAgICBpbnQuVHJ5UGFyc2UodGlja1ZhbHVlLCBvdXQgdGljaykgJlxyXG4gICAgICAgICAgICAgICAgZG91YmxlLlRyeVBhcnNlKHN0YXJ0VmFsdWUsIG91dCBzdGFydCkgJlxyXG4gICAgICAgICAgICAgICAgZG91YmxlLlRyeVBhcnNlKGdyb3d0aFZhbHVlLCBvdXQgZ3Jvd3RoKSAmXHJcbiAgICAgICAgICAgICAgICBkb3VibGUuVHJ5UGFyc2UoaGVhbHRoVmFsdWUsIG91dCBoZWFsdGgpICZcclxuICAgICAgICAgICAgICAgIGRvdWJsZS5UcnlQYXJzZShsYXN0VXBkYXRlVmFsdWUsIG91dCBsYXN0VXBkYXRlKSAmXHJcbiAgICAgICAgICAgICAgICBkb3VibGUuVHJ5UGFyc2Uod2F0ZXJMZXZlbFZhbHVlLCBvdXQgd2F0ZXJMZXZlbCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoIXBhcnNlU3VjY2VzcylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgVHJlZVN0YXRlKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgU2VlZCA9IHNlZWQsXHJcbiAgICAgICAgICAgICAgICBUaWNrcyA9IHRpY2ssXHJcbiAgICAgICAgICAgICAgICBHcm93dGggPSBncm93dGgsXHJcbiAgICAgICAgICAgICAgICBIZWFsdGggPSBoZWFsdGgsXHJcbiAgICAgICAgICAgICAgICBTdGFydFRpbWVzdGFtcCA9IHN0YXJ0LFxyXG4gICAgICAgICAgICAgICAgV2F0ZXJMZXZlbCA9IHdhdGVyTGV2ZWwsXHJcbiAgICAgICAgICAgICAgICBMYXN0RXZlbnRUaW1lc3RhbXAgPSBsYXN0VXBkYXRlLFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgU2V0KFRyZWVTdGF0ZSB0cmVlU3RhdGUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBXaW5kb3cuTG9jYWxTdG9yYWdlLlNldEl0ZW0oc2VlZEtleSwgdHJlZVN0YXRlLlNlZWQpO1xyXG4gICAgICAgICAgICBXaW5kb3cuTG9jYWxTdG9yYWdlLlNldEl0ZW0odGlja0tleSwgdHJlZVN0YXRlLlRpY2tzKTtcclxuICAgICAgICAgICAgV2luZG93LkxvY2FsU3RvcmFnZS5TZXRJdGVtKGhlYWx0aEtleSwgdHJlZVN0YXRlLkhlYWx0aCk7XHJcbiAgICAgICAgICAgIFdpbmRvdy5Mb2NhbFN0b3JhZ2UuU2V0SXRlbShncm93dGhLZXksIHRyZWVTdGF0ZS5Hcm93dGgpO1xyXG4gICAgICAgICAgICBXaW5kb3cuTG9jYWxTdG9yYWdlLlNldEl0ZW0oc3RhcnRLZXksIHRyZWVTdGF0ZS5TdGFydFRpbWVzdGFtcCk7XHJcbiAgICAgICAgICAgIFdpbmRvdy5Mb2NhbFN0b3JhZ2UuU2V0SXRlbSh3YXRlckxldmVsS2V5LCB0cmVlU3RhdGUuV2F0ZXJMZXZlbCk7XHJcbiAgICAgICAgICAgIFdpbmRvdy5Mb2NhbFN0b3JhZ2UuU2V0SXRlbShsYXN0VXBkYXRlS2V5LCB0cmVlU3RhdGUuTGFzdEV2ZW50VGltZXN0YW1wKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIFJlbW92ZUxlZ2FjeSgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBXaW5kb3cuTG9jYWxTdG9yYWdlLlJlbW92ZUl0ZW0oc2VlZEtleSk7XHJcbiAgICAgICAgICAgIFdpbmRvdy5Mb2NhbFN0b3JhZ2UuUmVtb3ZlSXRlbSh0aWNrS2V5KTtcclxuICAgICAgICAgICAgV2luZG93LkxvY2FsU3RvcmFnZS5SZW1vdmVJdGVtKGhlYWx0aEtleSk7XHJcbiAgICAgICAgICAgIFdpbmRvdy5Mb2NhbFN0b3JhZ2UuUmVtb3ZlSXRlbShncm93dGhLZXkpO1xyXG4gICAgICAgICAgICBXaW5kb3cuTG9jYWxTdG9yYWdlLlJlbW92ZUl0ZW0oc3RhcnRLZXkpO1xyXG4gICAgICAgICAgICBXaW5kb3cuTG9jYWxTdG9yYWdlLlJlbW92ZUl0ZW0od2F0ZXJMZXZlbEtleSk7XHJcbiAgICAgICAgICAgIFdpbmRvdy5Mb2NhbFN0b3JhZ2UuUmVtb3ZlSXRlbShsYXN0VXBkYXRlS2V5KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcclxudXNpbmcgU3lzdGVtLlRleHQ7XHJcblxyXG5uYW1lc3BhY2UgV2lzY2hpLkxENDYuS2VlcEl0QWxpdmVcclxue1xyXG4gICAgcHVibGljIGNsYXNzIFJhbmRvbVdyYXBwZXIgOiBJUmFuZG9tU291cmNlXHJcbiAgICB7XHJcbiAgICAgICAgcHJpdmF0ZSBSYW5kb20gcmFuZG9tO1xyXG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgaW50IHNlZWQ7XHJcblxyXG4gICAgICAgIHB1YmxpYyBSYW5kb21XcmFwcGVyKGludCBzZWVkKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5zZWVkID0gc2VlZDtcclxuICAgICAgICAgICAgUmVzZXQoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIFJlc2V0KClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJhbmRvbSA9IG5ldyBSYW5kb20oc2VlZCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgZG91YmxlIE5leHREb3VibGUoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJhbmRvbS5OZXh0RG91YmxlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiJdCn0K
