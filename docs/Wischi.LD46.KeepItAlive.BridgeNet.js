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
                this.sharedDrawingState.Seed = this.TreeBehaviour.TreeState.Seed;
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICJXaXNjaGkuTEQ0Ni5LZWVwSXRBbGl2ZS5CcmlkZ2VOZXQuanMiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbIkJvb3RzdHJhcC5jcyIsIkVhc2luZ0hlbHBlci5jcyIsIlRyZWVTdGF0ZVN0b3JlLmNzIiwiVHJlZURyYXdlci5jcyIsIlRhc2tYLmNzIiwiVHJlZUFwcENvbnRleHQuY3MiLCIuLi9XaXNjaGkuTEQ0Ni5LZWVwSXRBbGl2ZS5TaGFyZWQvVHJlZUJlaGF2aW91ckVuZ2luZS5jcyIsIlRyZWVEcmF3aW5nQ29udGV4dC5jcyIsIi4uL1dpc2NoaS5MRDQ2LktlZXBJdEFsaXZlLlNoYXJlZC9UcmVlRW52aXJvbm1lbnRDb25maWcuY3MiLCIuLi9XaXNjaGkuTEQ0Ni5LZWVwSXRBbGl2ZS5TaGFyZWQvVHJlZUNvbmZpZ3VyYXRpb25CdWlsZGVyLmNzIiwiLi4vV2lzY2hpLkxENDYuS2VlcEl0QWxpdmUuU2hhcmVkL1RyZWVDb25maWd1cmF0aW9ucy5jcyIsIi4uL1dpc2NoaS5MRDQ2LktlZXBJdEFsaXZlLlNoYXJlZC9UcmVlU3RhdGVGYWN0b3J5LmNzIiwiLi4vV2lzY2hpLkxENDYuS2VlcEl0QWxpdmUuU2hhcmVkL1JhbmRvbUV4dGVuc2lvbnMuY3MiLCIuLi9XaXNjaGkuTEQ0Ni5LZWVwSXRBbGl2ZS5TaGFyZWQvVHJlZUJ1aWxkZXIuY3MiLCIuLi9XaXNjaGkuTEQ0Ni5LZWVwSXRBbGl2ZS5TaGFyZWQvVHJlZVNlZ21lbnQuY3MiLCIuLi9XaXNjaGkuTEQ0Ni5LZWVwSXRBbGl2ZS5TaGFyZWQvVmVjdG9yMkQuY3MiLCJCcmlkZ2VDbG9jay5jcyIsIkxvY2FsU3RvcmFnZUxlZ2FjeVRyZWVTdGF0ZVN0b3JlLmNzIiwiLi4vV2lzY2hpLkxENDYuS2VlcEl0QWxpdmUuU2hhcmVkL1JhbmRvbVdyYXBwZXIuY3MiXSwKICAibmFtZXMiOiBbIiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O29CQWtC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QUE0QkE7Z0JBQzdDQSxrQkFBa0JBLHNDQUE0QkE7Z0JBQzlDQSxrQkFBa0JBLHNDQUE0QkE7Z0JBQzlDQSxzQkFBc0JBLHNDQUE0QkE7Z0JBQ2xEQSxzQkFBc0JBLHNDQUE0QkE7Z0JBQzlEQTtnQkFDQUE7Z0JBQ0FBO2dCQUNBQTtnQkFDQUE7Z0JBQ0FBO2dCQUNBQTs7O2dCQUtZQSxtQkFDSUEsd0NBQWFBLFdBQWVBLFFBQzVCQSxzQkFBYUEsV0FBZUEsU0FDNUJBLHVCQUFnQkEsa0JBQWdCQSxVQUNoQ0EsdUJBQWdCQSxtQkFBaUJBLFdBQ2pDQSx1QkFBZ0JBLG1CQUFpQkEsV0FDakNBLHVCQUFnQkEsdUJBQXFCQSxlQUNyQ0EsdUJBQWdCQSx1QkFBcUJBOztnQkFFekNBLElBQUlBLENBQUNBO29CQUVEQSxPQUFPQTs7O2dCQUdYQSxPQUFPQSxVQUFJQSx5REFFQUEsbUJBQ0NBLGtDQUNDQSxzQkFDQUEsOEJBQ1FBLHlCQUNKQSxzQ0FDUUE7OzJCQUliQTtnQkFFWkEsNEJBQTRCQSxjQUFTQTtnQkFDckNBLDRCQUE0QkEsY0FBU0E7Z0JBQ3JDQSw0QkFBNEJBLGdCQUFXQTtnQkFDdkNBLDRCQUE0QkEsZ0JBQVdBO2dCQUN2Q0EsNEJBQTRCQSxlQUFVQTtnQkFDdENBLDRCQUE0QkEsb0JBQWVBO2dCQUMzQ0EsNEJBQTRCQSxvQkFBZUE7OztnQkFLM0NBLCtCQUErQkE7Z0JBQy9CQSwrQkFBK0JBO2dCQUMvQkEsK0JBQStCQTtnQkFDL0JBLCtCQUErQkE7Z0JBQy9CQSwrQkFBK0JBO2dCQUMvQkEsK0JBQStCQTtnQkFDL0JBLCtCQUErQkE7Ozs7Ozs7Ozs7Ozs7NEJDckZkQTs7Z0JBRWpCQSxZQUFZQTtnQkFDWkE7Ozs7O2dCQUtBQSxjQUFTQSxJQUFJQSxxQkFBT0E7OztnQkFLcEJBLE9BQU9BIiwKICAic291cmNlc0NvbnRlbnQiOiBbInVzaW5nIEJyaWRnZTtcclxudXNpbmcgQnJpZGdlLkh0bWw1O1xyXG51c2luZyBTeXN0ZW07XHJcbnVzaW5nIFN5c3RlbS5UaHJlYWRpbmcuVGFza3M7XHJcblxyXG5uYW1lc3BhY2UgV2lzY2hpLkxENDYuS2VlcEl0QWxpdmUuQnJpZGdlTmV0XHJcbntcclxuICAgIHB1YmxpYyBzdGF0aWMgY2xhc3MgQm9vdHN0cmFwXHJcbiAgICB7XHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgUmFuZG9tIHJuZztcclxuICAgICAgICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBCcmlkZ2VDbG9jayBjbG9jaztcclxuICAgICAgICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBUcmVlRW52aXJvbm1lbnRDb25maWcgY29uZmlnO1xyXG4gICAgICAgIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IFRyZWVTdGF0ZUZhY3RvcnkgdHJlZVN0YXRlRmFjdG9yeTtcclxuICAgICAgICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBUcmVlU3RhdGVTdG9yZSB0cmVlU3RhdGVTdG9yZTtcclxuICAgICAgICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBTaGFyZWREcmF3aW5nU3RhdGUgc2hhcmVkRHJhd2luZ1N0YXRlO1xyXG5cclxuICAgICAgICBzdGF0aWMgQm9vdHN0cmFwKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJuZyA9IG5ldyBSYW5kb20oKTtcclxuICAgICAgICAgICAgY2xvY2sgPSBuZXcgQnJpZGdlQ2xvY2soKTtcclxuICAgICAgICAgICAgY29uZmlnID0gVHJlZUVudmlyb25tZW50Q29uZmlncy5SZWxlYXNlO1xyXG4gICAgICAgICAgICBzaGFyZWREcmF3aW5nU3RhdGUgPSBuZXcgU2hhcmVkRHJhd2luZ1N0YXRlKCk7XHJcblxyXG4gICAgICAgICAgICB0cmVlU3RhdGVGYWN0b3J5ID0gbmV3IFRyZWVTdGF0ZUZhY3Rvcnkocm5nLCBjbG9jaywgY29uZmlnKTtcclxuICAgICAgICAgICAgdHJlZVN0YXRlU3RvcmUgPSBuZXcgVHJlZVN0YXRlU3RvcmUoY29uZmlnLlNldHRpbmdQcmVmaXgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgVGFzazxIVE1MSW1hZ2VFbGVtZW50PiBMb2FkSW1hZ2VBc3luYyhzdHJpbmcgc3JjKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIGltYWdlRWxlbWVudCA9IG5ldyBIVE1MSW1hZ2VFbGVtZW50KCk7XHJcbiAgICAgICAgICAgIHZhciBjb21wbGV0aW9uU291cmNlID0gbmV3IFRhc2tDb21wbGV0aW9uU291cmNlPEhUTUxJbWFnZUVsZW1lbnQ+KCk7XHJcbiAgICAgICAgICAgIGltYWdlRWxlbWVudC5TcmMgPSBzcmM7XHJcblxyXG4gICAgICAgICAgICBpbWFnZUVsZW1lbnQuQWRkRXZlbnRMaXN0ZW5lcihFdmVudFR5cGUuTG9hZCwgKEFjdGlvbikoKCkgPT5cclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY29tcGxldGlvblNvdXJjZS5TZXRSZXN1bHQoaW1hZ2VFbGVtZW50KTtcclxuICAgICAgICAgICAgfSkpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGNvbXBsZXRpb25Tb3VyY2UuVGFzaztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgc3RhdGljIGFzeW5jIFRhc2sgTWlncmF0ZVNldHRpbmdzQXN5bmMoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIGxlZ2FjeVN0YXRlU3RvcmUgPSBuZXcgTG9jYWxTdG9yYWdlTGVnYWN5VHJlZVN0YXRlU3RvcmUoY29uZmlnLlNldHRpbmdQcmVmaXgpO1xyXG5cclxuICAgICAgICAgICAgdmFyIHN0YXRlID0gbGVnYWN5U3RhdGVTdG9yZS5HZXQoKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChzdGF0ZSAhPSBudWxsKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAvLyBtaWdyYXRlIHRvIG5ldyBzdG9yZVxyXG4gICAgICAgICAgICAgICAgYXdhaXQgdHJlZVN0YXRlU3RvcmUuU2V0KHN0YXRlKTtcclxuICAgICAgICAgICAgICAgIGxlZ2FjeVN0YXRlU3RvcmUuUmVtb3ZlTGVnYWN5KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgc3RhdGljIHZvaWQgU2V0SGFzaEFzU3luY1Rva2VuKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBocyA9IFdpbmRvdy5Mb2NhdGlvbi5IYXNoO1xyXG5cclxuICAgICAgICAgICAgaWYgKGhzLlN0YXJ0c1dpdGgoXCIjXCIpKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBocyA9IGhzLlN1YnN0cmluZygxKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCFzdHJpbmcuSXNOdWxsT3JXaGl0ZVNwYWNlKGhzKSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdHJlZVN0YXRlU3RvcmUuU3luY1Rva2VuID0gaHM7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBXaW5kb3cuTG9jYXRpb24uSGFzaCA9IFwiI1wiICsgdHJlZVN0YXRlU3RvcmUuU3luY1Rva2VuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBbUmVhZHldXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBhc3luYyBUYXNrIE1haW5Bc3luYygpXHJcbiAgICAgICAge1xyXG5TeXN0ZW0uQWN0aW9uIFVwZGF0ZVN0YXRlQW5kRHJhdyA9IG51bGw7XG5TeXN0ZW0uQWN0aW9uIERyYXcgPSBudWxsO1xuSFRNTENhbnZhc0VsZW1lbnQgY2FudmFzOyAgICAgICAgICAgIGlmICghKChjYW52YXMgPSBEb2N1bWVudC5HZXRFbGVtZW50QnlJZChcImNhbnZhc1wiKSBhcyBIVE1MQ2FudmFzRWxlbWVudCkgIT0gbnVsbCkpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIENvbnNvbGUuV3JpdGUoXCJDYW52YXMgbm90IGZvdW5kLiBFeGl0aW5nLlwiKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyIGxvYWRlciA9IG5ldyBMb2FkaW5nRHJhd2VyKGNhbnZhcyk7XHJcbiAgICAgICAgICAgIGxvYWRlci5EcmF3KCk7XHJcblxyXG4gICAgICAgICAgICBhd2FpdCBNaWdyYXRlU2V0dGluZ3NBc3luYygpO1xyXG5cclxuICAgICAgICAgICAgU2V0SGFzaEFzU3luY1Rva2VuKCk7XHJcblxyXG4gICAgICAgICAgICB0cmVlU3RhdGVTdG9yZS5TeW5jVG9rZW5DaGFuZ2VkICs9IChzLCBlKSA9PlxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBXaW5kb3cuTG9jYXRpb24uSGFzaCA9IFwiI1wiICsgdHJlZVN0YXRlU3RvcmUuU3luY1Rva2VuO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgdmFyIGNvbnRleHQgPSBuZXcgVHJlZUFwcENvbnRleHQoXHJcbiAgICAgICAgICAgICAgICBjbG9jayxcclxuICAgICAgICAgICAgICAgIGNvbmZpZyxcclxuICAgICAgICAgICAgICAgIHRyZWVTdGF0ZVN0b3JlLFxyXG4gICAgICAgICAgICAgICAgdHJlZVN0YXRlRmFjdG9yeSxcclxuICAgICAgICAgICAgICAgIHNoYXJlZERyYXdpbmdTdGF0ZVxyXG4gICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgYXdhaXQgY29udGV4dC5Jbml0aWFsaXplQXN5bmMoKTtcclxuICAgICAgICAgICAgY29udGV4dC5VcGRhdGVHYW1lU3RhdGUoKTtcclxuXHJcbiAgICAgICAgICAgIHZhciB3YXRlclRhc2sgPSBMb2FkSW1hZ2VBc3luYyhcImltZy93YXRlci5wbmdcIik7XHJcbiAgICAgICAgICAgIHZhciByZXNldFRhc2sgPSBMb2FkSW1hZ2VBc3luYyhcImltZy9yZXNldC5wbmdcIik7XHJcbiAgICAgICAgICAgIHZhciBhdXRvU2F2ZVRhc2sgPSBjb250ZXh0LkF1dG9TYXZlKCk7XHJcblxyXG4gICAgICAgICAgICBhd2FpdCBUYXNrLldoZW5BbGwod2F0ZXJUYXNrLCByZXNldFRhc2ssIGF1dG9TYXZlVGFzayk7XHJcblxyXG4gICAgICAgICAgICB2YXIgd2F0ZXIgPSB3YXRlclRhc2suUmVzdWx0O1xyXG4gICAgICAgICAgICB2YXIgcmVzZXQgPSByZXNldFRhc2suUmVzdWx0O1xyXG5IVE1MSW5wdXRFbGVtZW50IHNsaWRlcjtcclxuICAgICAgICAgICAgaWYgKChzbGlkZXIgPSBEb2N1bWVudC5HZXRFbGVtZW50QnlJZChcInNsaWRlclwiKSBhcyBIVE1MSW5wdXRFbGVtZW50KSAhPSBudWxsKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBzbGlkZXIuQWRkRXZlbnRMaXN0ZW5lcihFdmVudFR5cGUuSW5wdXQsIChBY3Rpb24pKCgpID0+XHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZhY3RvciA9IGludC5QYXJzZShzbGlkZXIuVmFsdWUpIC8gMTAwLjA7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGV4dC5UcmVlQmVoYXZpb3VyLlRyZWVTdGF0ZS5Hcm93dGggPSBmYWN0b3I7XHJcbiAgICAgICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciBkcmF3ZXIgPSBuZXcgVHJlZURyYXdlcihjYW52YXMsIHdhdGVyLCByZXNldCwgc2hhcmVkRHJhd2luZ1N0YXRlKTtcclxuRHJhdyA9ICgpID0+XHJcbntcclxuICAgIGNvbnRleHQuVXBkYXRlUHJlUmVuZGVyKCk7XHJcbiAgICBkcmF3ZXIuRHJhdygpO1xyXG59XHJcblxyXG47XG5VcGRhdGVTdGF0ZUFuZERyYXcgPSAoKSA9PlxyXG57XHJcbiAgICBjb250ZXh0LlVwZGF0ZUdhbWVTdGF0ZSgpO1xyXG4gICAgRHJhdygpO1xyXG59XHJcblxyXG47XG5cclxuICAgICAgICAgICAgV2luZG93Lk9uSGFzaENoYW5nZSA9IGFzeW5jIChfKSA9PlxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBTZXRIYXNoQXNTeW5jVG9rZW4oKTtcclxuICAgICAgICAgICAgICAgIGF3YWl0IGNvbnRleHQuSW5pdGlhbGl6ZUFzeW5jKCk7XHJcbiAgICAgICAgICAgICAgICBVcGRhdGVTdGF0ZUFuZERyYXcoKTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIFxyXG5cclxuICAgICAgICAgICAgXHJcblxyXG4gICAgICAgICAgICB3YXRlci5BZGRFdmVudExpc3RlbmVyKEV2ZW50VHlwZS5Mb2FkLCAoQWN0aW9uKVVwZGF0ZVN0YXRlQW5kRHJhdyk7XHJcblxyXG4gICAgICAgICAgICBjYW52YXMuQWRkRXZlbnRMaXN0ZW5lcihFdmVudFR5cGUuQ2xpY2ssIChBY3Rpb248RXZlbnQ+KShhc3luYyAoZSkgPT5cclxuICAgICAgICAgICAge1xyXG5Nb3VzZUV2ZW50IG1lOyAgICAgICAgICAgICAgICBpZiAoISgobWUgPSBlIGFzIE1vdXNlRXZlbnQpICE9IG51bGwpKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBTY3JpcHQuV3JpdGUoXCJ2YXIgcmVjdCA9IGUudGFyZ2V0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1wiKTtcclxuICAgICAgICAgICAgICAgIFNjcmlwdC5Xcml0ZShcInZhciB4ID0gTWF0aC5mbG9vcihlLmNsaWVudFggLSByZWN0LmxlZnQpO1wiKTtcclxuICAgICAgICAgICAgICAgIFNjcmlwdC5Xcml0ZShcInZhciB5ID0gTWF0aC5mbG9vcihlLmNsaWVudFkgLSByZWN0LnRvcCk7XCIpO1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciB4eCA9IFNjcmlwdC5HZXQ8aW50PihcInhcIik7XHJcbiAgICAgICAgICAgICAgICB2YXIgeXkgPSBTY3JpcHQuR2V0PGludD4oXCJ5XCIpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIEhpdC1UZXN0IGZvciBcImJ1dHRvblwiXHJcbiAgICAgICAgICAgICAgICBpZiAoeHggPD0gODAgJiYgeXkgPj0gNDMwKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjb250ZXh0LlRyZWVCZWhhdmlvdXIuVHJlZVN0YXRlLkhlYWx0aCA9PSAwKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gUmVzZXQgVHJlZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCBjb250ZXh0LlJlc2V0VHJlZUFzeW5jKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IGNvbnRleHQuV2F0ZXJBc3luYygpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgVXBkYXRlU3RhdGVBbmREcmF3KCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pKTtcclxuXHJcbiAgICAgICAgICAgIFdpbmRvdy5TZXRJbnRlcnZhbCgoQWN0aW9uKURyYXcsIGNvbmZpZy5Nc1JlZnJlc2hSYXRlKTtcclxuICAgICAgICAgICAgV2luZG93LlNldEludGVydmFsKChBY3Rpb24pY29udGV4dC5VcGRhdGVHYW1lU3RhdGUsIGNvbmZpZy5Nc1RpY2tSYXRlKTtcclxuICAgICAgICAgICAgV2luZG93LlNldEludGVydmFsKCgpID0+IEJyaWRnZS5TY3JpcHQuRGlzY2FyZD0gY29udGV4dC5BdXRvU2F2ZSgpLCBjb25maWcuTXNBdXRvU2F2ZSk7XHJcblxyXG4gICAgICAgICAgICBVcGRhdGVTdGF0ZUFuZERyYXcoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG5cclxubmFtZXNwYWNlIFdpc2NoaS5MRDQ2LktlZXBJdEFsaXZlLkJyaWRnZU5ldFxyXG57XHJcbiAgICBwdWJsaWMgc3RhdGljIGNsYXNzIEVhc2luZ0hlbHBlclxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZG91YmxlIEVhc2VPdXRTaW5lKGRvdWJsZSB4KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuIE1hdGguU2luKHggKiBNYXRoLlBJIC8gMik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGRvdWJsZSBFYXNlT3V0UXVhZChkb3VibGUgeClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJldHVybiAxIC0gKDEgLSB4KSAqICgxIC0geCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGRvdWJsZSBFYXNlT3V0UXVpbnQoZG91YmxlIHgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gMSAtIE1hdGguUG93KDEgLSB4LCA1KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZG91YmxlIEVhc2VJblF1YWQoZG91YmxlIHgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4geCAqIHggKiB4ICogeDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZG91YmxlIEVhc2VJblF1YWRPZmZzZXQoZG91YmxlIHgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB4ID0geCAqIDAuNSArIDAuNTtcclxuICAgICAgICAgICAgcmV0dXJuIHggKiB4ICogeCAqIHg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGRvdWJsZSBFYXNlTGluZWFyKGRvdWJsZSB4KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuIHg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGRvdWJsZSBFYXNlSW5FeHAoZG91YmxlIGZhY3RvcilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmIChmYWN0b3IgPD0gMClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBNYXRoLlBvdygyLCAxMCAqIGZhY3RvciAtIDEwKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgQnJpZGdlLkh0bWw1O1xyXG51c2luZyBOZXd0b25zb2Z0Lkpzb247XHJcbnVzaW5nIFN5c3RlbTtcclxudXNpbmcgU3lzdGVtLlRocmVhZGluZy5UYXNrcztcclxuXHJcbm5hbWVzcGFjZSBXaXNjaGkuTEQ0Ni5LZWVwSXRBbGl2ZS5CcmlkZ2VOZXRcclxue1xyXG4gICAgcHVibGljIGNsYXNzIFRyZWVTdGF0ZVN0b3JlXHJcbiAgICB7XHJcbiAgICAgICAgcHJpdmF0ZSByZWFkb25seSBzdHJpbmcgdHJlZVN0YXRlS2V5O1xyXG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgc3RyaW5nIHRva2VuS2V5O1xyXG5cclxuICAgICAgICBwcml2YXRlIHJlYWRvbmx5IEtWUyBrdnM7XHJcblxyXG4gICAgICAgIHB1YmxpYyBUcmVlU3RhdGVTdG9yZShzdHJpbmcgcHJlZml4KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdHJlZVN0YXRlS2V5ID0gcHJlZml4ICsgXCIuVHJlZVN0YXRlVjFcIjtcclxuICAgICAgICAgICAgdG9rZW5LZXkgPSBwcmVmaXggKyBcIi5Ub2tlblwiO1xyXG5cclxuICAgICAgICAgICAga3ZzID0gbmV3IEtWUygpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIGV2ZW50IEV2ZW50SGFuZGxlciBTeW5jVG9rZW5DaGFuZ2VkO1xyXG5cclxuICAgICAgICBwdWJsaWMgc3RyaW5nIFN5bmNUb2tlblxyXG57XHJcbiAgICBnZXRcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gV2luZG93LkxvY2FsU3RvcmFnZS5HZXRJdGVtKHRva2VuS2V5KSBhcyBzdHJpbmc7XHJcbiAgICB9XHJcblxyXG4gICAgXHJcbiAgICBzZXRcclxuICAgIHtcclxuICAgICAgICBXaW5kb3cuTG9jYWxTdG9yYWdlLlNldEl0ZW0odG9rZW5LZXksIHZhbHVlKTtcclxuICAgICAgICBTeW5jVG9rZW5DaGFuZ2VkIT1udWxsP2dsb2JhbDo6QnJpZGdlLlNjcmlwdC5Gcm9tTGFtYmRhKCgpPT5TeW5jVG9rZW5DaGFuZ2VkLkludm9rZSh0aGlzLCBFdmVudEFyZ3MuRW1wdHkpKTpudWxsO1xyXG4gICAgfVxyXG59XHJcbiAgICAgICAgcHVibGljIGFzeW5jIFRhc2s8VHJlZVN0YXRlPiBHZXQoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIGNsb3VkU3RhdGUgPSBhd2FpdCBTdGF0ZUZyb21LdnNBc3luYygpO1xyXG4gICAgICAgICAgICByZXR1cm4gY2xvdWRTdGF0ZSA/PyBMb2FkRnJvbUxvY2FsU3RvcmFnZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIGFzeW5jIFRhc2sgU2V0KFRyZWVTdGF0ZSB0cmVlU3RhdGUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBTYXZlVG9Mb2NhbFN0b3JhZ2UodHJlZVN0YXRlKTtcclxuICAgICAgICAgICAgYXdhaXQgU2F2ZVN0YXRlVG9LdnNBc3luYyh0cmVlU3RhdGUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSB2b2lkIFNhdmVUb0xvY2FsU3RvcmFnZShUcmVlU3RhdGUgdHJlZVN0YXRlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKHRyZWVTdGF0ZSA9PSBudWxsKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBXaW5kb3cuTG9jYWxTdG9yYWdlLlJlbW92ZUl0ZW0odHJlZVN0YXRlS2V5KTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyIHRyZWVKc29uID0gSnNvbkNvbnZlcnQuU2VyaWFsaXplT2JqZWN0KHRyZWVTdGF0ZSk7XHJcbiAgICAgICAgICAgIFdpbmRvdy5Mb2NhbFN0b3JhZ2UuU2V0SXRlbSh0cmVlU3RhdGVLZXksIHRyZWVKc29uKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgVHJlZVN0YXRlIExvYWRGcm9tTG9jYWxTdG9yYWdlKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciB0cmVlSnNvbiA9IFdpbmRvdy5Mb2NhbFN0b3JhZ2UuR2V0SXRlbSh0cmVlU3RhdGVLZXkpIGFzIHN0cmluZztcclxuXHJcbiAgICAgICAgICAgIGlmIChzdHJpbmcuSXNOdWxsT3JXaGl0ZVNwYWNlKHRyZWVKc29uKSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBKc29uQ29udmVydC5EZXNlcmlhbGl6ZU9iamVjdDxUcmVlU3RhdGU+KHRyZWVKc29uKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgYXN5bmMgVGFzazxUcmVlU3RhdGU+IFN0YXRlRnJvbUt2c0FzeW5jKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciByZXNwID0gYXdhaXQga3ZzLkdldEFzeW5jKFN5bmNUb2tlbik7XHJcblxyXG4gICAgICAgICAgICBpZiAocmVzcC5TdGF0dXNDb2RlID09IDIwMClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYgKHN0cmluZy5Jc051bGxPcldoaXRlU3BhY2UocmVzcC5Db250ZW50KSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gSnNvbkNvbnZlcnQuRGVzZXJpYWxpemVPYmplY3Q8VHJlZVN0YXRlPihyZXNwLkNvbnRlbnQpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAocmVzcC5TdGF0dXNDb2RlID49IDQwMCAmJiByZXNwLlN0YXR1c0NvZGUgPD0gNDk5KVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAvLyBub3QgZm91bmQsIGdldCBuZXcgdG9rZW5cclxuICAgICAgICAgICAgICAgIHJlc3AgPSBhd2FpdCBrdnMuTmV3QXN5bmMoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAocmVzcC5TdGF0dXNDb2RlID09IDIwMClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBTeW5jVG9rZW4gPSByZXNwLkNvbnRlbnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEV4Y2VwdGlvbihcIkZhaWxlZCB0byBnZXQgbmV3IHRva2VuXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKFwiRmFpbGVkIHRvIGdldCB0cmVlIHN0YXRlIGZyb20ga2V5c3RvcmVcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIGFzeW5jIFRhc2sgU2F2ZVN0YXRlVG9LdnNBc3luYyhUcmVlU3RhdGUgc3RhdGUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgZGF0YSA9IHN0YXRlID09IG51bGwgPyBzdHJpbmcuRW1wdHkgOiBKc29uQ29udmVydC5TZXJpYWxpemVPYmplY3Qoc3RhdGUpO1xyXG5cclxuICAgICAgICAgICAgdmFyIHJlc3AgPSBhd2FpdCBrdnMuU2V0QXN5bmMoU3luY1Rva2VuLCBkYXRhKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChyZXNwLlN0YXR1c0NvZGUgIT0gMjAwKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXNwID0gYXdhaXQga3ZzLk5ld0FzeW5jKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHJlc3AuU3RhdHVzQ29kZSA9PSAyMDApXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQga3ZzLlNldEFzeW5jKFN5bmNUb2tlbiwgZGF0YSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vdmFyIHJlcyA9IFdpbmRvdy5Mb2NhbFN0b3JhZ2UuR2V0SXRlbShjb25maWcuU2V0dGluZ1ByZWZpeCArIFwiLlRva2VuXCIpIGFzIHN0cmluZztcclxuICAgICAgICAvL3ZhciBlbXBmID0gcmVzID09IG51bGw7XHJcbiAgICAgICAgLy9Db25zb2xlLldyaXRlKFwiUmVzOiBcIiArIGVtcGYpO1xyXG5cclxuICAgICAgICAvL1Rhc2suXHJcbiAgICAgICAgLy9UYXNrLkZyb21DYWxsYmFjaygpXHJcblxyXG5cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY2xhc3MgSHR0cFJlc3BvbnNlXHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIEh0dHBSZXNwb25zZSh1c2hvcnQgc3RhdHVzQ29kZSwgc3RyaW5nIGNvbnRlbnQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBTdGF0dXNDb2RlID0gc3RhdHVzQ29kZTtcclxuICAgICAgICAgICAgQ29udGVudCA9IGNvbnRlbnQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdXNob3J0IFN0YXR1c0NvZGUgeyBnZXQ7IHByaXZhdGUgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIHN0cmluZyBDb250ZW50IHsgZ2V0OyBwcml2YXRlIHNldDsgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjbGFzcyBLVlNcclxuICAgIHtcclxuICAgICAgICBwcml2YXRlIGNvbnN0IHN0cmluZyBiYXNlVXJsID0gXCJodHRwczovL2FwaS5rZXl2YWx1ZS54eXovXCI7XHJcbiAgICAgICAgcHJpdmF0ZSBjb25zdCBpbnQgYmFzZVVybExlbiA9IDI1O1xyXG4gICAgICAgIHByaXZhdGUgY29uc3Qgc3RyaW5nIHN1ZmZpeCA9IFwidHJlZVwiO1xyXG5cclxuICAgICAgICBwdWJsaWMgYXN5bmMgVGFzazxIdHRwUmVzcG9uc2U+IE5ld0FzeW5jKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciB1cmwgPSBHZXRVcmxXaXRoVG9rZW4oXCJuZXdcIik7XHJcblxyXG4gICAgICAgICAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiAgICAgICAgICAgIHhoci5PcGVuKFwiUE9TVFwiLCB1cmwpO1xyXG5cclxuICAgICAgICAgICAgdmFyIHNvdXJjZSA9IEdldENvbXBsZXRpb25Tb3VyY2VGb3JSZXF1ZXN0KHhocik7XHJcbiAgICAgICAgICAgIHhoci5TZW5kKCk7XHJcblxyXG4gICAgICAgICAgICB2YXIgcmVzcCA9IGF3YWl0IHNvdXJjZS5UYXNrO1xyXG5cclxuICAgICAgICAgICAgaWYgKHJlc3AuU3RhdHVzQ29kZSAhPSAyMDApXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXNwO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gbmV3IEh0dHBSZXNwb25zZSgyMDAsIEdldFRva2VuRnJvbVVybChyZXNwLkNvbnRlbnQpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBUYXNrPEh0dHBSZXNwb25zZT4gR2V0QXN5bmMoc3RyaW5nIHRva2VuKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIHVybCA9IEdldFVybFdpdGhUb2tlbih0b2tlbik7XHJcblxyXG4gICAgICAgICAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiAgICAgICAgICAgIHhoci5PcGVuKFwiR0VUXCIsIHVybCk7XHJcblxyXG4gICAgICAgICAgICB2YXIgc291cmNlID0gR2V0Q29tcGxldGlvblNvdXJjZUZvclJlcXVlc3QoeGhyKTtcclxuICAgICAgICAgICAgeGhyLlNlbmQoKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBzb3VyY2UuVGFzaztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBUYXNrPEh0dHBSZXNwb25zZT4gU2V0QXN5bmMoc3RyaW5nIHRva2VuLCBzdHJpbmcgdmFsdWUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgdXJsID0gR2V0VXJsV2l0aFRva2VuKHRva2VuKTtcclxuXHJcbiAgICAgICAgICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgICAgICAgICAgeGhyLk9wZW4oXCJQT1NUXCIsIHVybCk7XHJcblxyXG4gICAgICAgICAgICB2YXIgc291cmNlID0gR2V0Q29tcGxldGlvblNvdXJjZUZvclJlcXVlc3QoeGhyKTtcclxuICAgICAgICAgICAgeGhyLlNlbmQodmFsdWUpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHNvdXJjZS5UYXNrO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgVGFza0NvbXBsZXRpb25Tb3VyY2U8SHR0cFJlc3BvbnNlPiBHZXRDb21wbGV0aW9uU291cmNlRm9yUmVxdWVzdChYTUxIdHRwUmVxdWVzdCB4aHIpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgc291cmNlID0gbmV3IFRhc2tDb21wbGV0aW9uU291cmNlPEh0dHBSZXNwb25zZT4oKTtcclxuXHJcbiAgICAgICAgICAgIHhoci5PbkxvYWQgPSBhID0+XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHZhciByZXMgPSBuZXcgSHR0cFJlc3BvbnNlKHhoci5TdGF0dXMsIHhoci5SZXNwb25zZVRleHQpO1xyXG4gICAgICAgICAgICAgICAgc291cmNlLlNldFJlc3VsdChyZXMpO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgeGhyLk9uQWJvcnQgPSBhID0+IHNvdXJjZS5TZXRDYW5jZWxlZCgpO1xyXG4gICAgICAgICAgICB4aHIuT25FcnJvciA9IGEgPT4gc291cmNlLlNldEV4Y2VwdGlvbihuZXcgRXhjZXB0aW9uKFwiRXJyb3JcIikpO1xyXG4gICAgICAgICAgICB4aHIuT25UaW1lb3V0ID0gYSA9PiBzb3VyY2UuU2V0RXhjZXB0aW9uKG5ldyBFeGNlcHRpb24oXCJUaW1lb3V0XCIpKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBzb3VyY2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHN0YXRpYyBzdHJpbmcgR2V0VXJsV2l0aFRva2VuKHN0cmluZyB0b2tlbilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJldHVybiBzdHJpbmcuRm9ybWF0KFwiezB9ezF9L3syfVwiLGJhc2VVcmwsdG9rZW4sc3VmZml4KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgc3RhdGljIHN0cmluZyBHZXRUb2tlbkZyb21Vcmwoc3RyaW5nIHVybClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBwYXRoID0gdXJsLlN1YnN0cmluZyhiYXNlVXJsTGVuKTtcclxuICAgICAgICAgICAgdmFyIGluZGV4U2xhc2ggPSBwYXRoLkluZGV4T2YoJy8nKTtcclxuICAgICAgICAgICAgcmV0dXJuIHBhdGguU3Vic3RyaW5nKDAsIGluZGV4U2xhc2gpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBCcmlkZ2UuSHRtbDU7XHJcbnVzaW5nIFN5c3RlbTtcclxuXHJcbm5hbWVzcGFjZSBXaXNjaGkuTEQ0Ni5LZWVwSXRBbGl2ZS5CcmlkZ2VOZXRcclxue1xyXG4gICAgcHVibGljIGNsYXNzIExvYWRpbmdEcmF3ZXJcclxuICAgIHtcclxuICAgICAgICBwcml2YXRlIHJlYWRvbmx5IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCBjdHg7XHJcblxyXG4gICAgICAgIHB1YmxpYyBMb2FkaW5nRHJhd2VyKEhUTUxDYW52YXNFbGVtZW50IGNhbnZhcylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGN0eCA9IGNhbnZhcy5HZXRDb250ZXh0KENhbnZhc1R5cGVzLkNhbnZhc0NvbnRleHQyRFR5cGUuQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIERyYXcoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY3R4LkZpbGxTdHlsZSA9IFwiI0IyRkZGRlwiO1xyXG4gICAgICAgICAgICBjdHguQ2xlYXJSZWN0KDAsIDAsIDUxMiwgNTEyKTtcclxuICAgICAgICAgICAgY3R4LkZpbGxSZWN0KDAsIDAsIDUxMiwgNTEyKTtcclxuXHJcbiAgICAgICAgICAgIGN0eC5GaWxsU3R5bGUgPSBcIiMwMDBcIjtcclxuICAgICAgICAgICAgY3R4LkZvbnQgPSBcImJvbGQgMTZweCBBcmlhbCwgc2Fucy1zZXJpZlwiO1xyXG5cclxuICAgICAgICAgICAgY3R4LkZpbGxUZXh0KFwiTG9hZGluZy4uLlwiLCA3LCAyMCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjbGFzcyBUcmVlRHJhd2VyXHJcbiAgICB7XHJcbiAgICAgICAgcHJpdmF0ZSByZWFkb25seSBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgY3R4O1xyXG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgUmFuZG9tIHJuZCA9IG5ldyBSYW5kb20oKTtcclxuXHJcbiAgICAgICAgcHJpdmF0ZSByZWFkb25seSBUcmVlRHJhd2luZ0NvbnRleHQgdHJlZURyYXdpbmdDb250ZXh0O1xyXG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgSFRNTEltYWdlRWxlbWVudCB3YXRlcjtcclxuICAgICAgICBwcml2YXRlIHJlYWRvbmx5IEhUTUxJbWFnZUVsZW1lbnQgcmVzZXQ7XHJcbiAgICAgICAgcHJpdmF0ZSByZWFkb25seSBTaGFyZWREcmF3aW5nU3RhdGUgc2hhcmVkRHJhd2luZ1N0YXRlO1xyXG5cclxuICAgICAgICBwcml2YXRlIFRyZWVTZWdtZW50IHRydW5rO1xyXG4gICAgICAgIHByaXZhdGUgUmFuZG9tV3JhcHBlciBncmFzc1JhbmRvbTtcclxuXHJcbiAgICAgICAgcHJpdmF0ZSBjb25zdCBpbnQgQ2FudmFzV2lkdGggPSA1MTI7XHJcbiAgICAgICAgcHJpdmF0ZSBjb25zdCBpbnQgQ2FudmFzSGVpZ2h0ID0gNTEyO1xyXG4gICAgICAgIHByaXZhdGUgY29uc3QgZG91YmxlIFNjYWxlRmFjdG9yID0gODA7XHJcbiAgICAgICAgcHJpdmF0ZSBjb25zdCBpbnQgVHJlZVlPZmZzZXQgPSA0MjA7XHJcbnByaXZhdGUgc3RyaW5nIFNreUNvbG9yXHJcbntcclxuICAgIGdldFxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBzaGFyZWREcmF3aW5nU3RhdGUuSXNEZWFkID8gXCIjNDQ0XCIgOiBcIiNCMkZGRkZcIjtcclxuICAgIH1cclxufXByaXZhdGUgc3RyaW5nIEdyYXNzQmFja2dyb3VuZENvbG9yXHJcbntcclxuICAgIGdldFxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBzaGFyZWREcmF3aW5nU3RhdGUuSXNEZWFkID8gXCIjMzMzXCIgOiBcIiM3RUM4NTBcIjtcclxuICAgIH1cclxufXByaXZhdGUgc3RyaW5nIEdyYXNzQ29sb3Jcclxue1xyXG4gICAgZ2V0XHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHNoYXJlZERyYXdpbmdTdGF0ZS5Jc0RlYWQgPyBcIiMxMTFcIiA6IFwiIzIwNjQxMVwiO1xyXG4gICAgfVxyXG59XHJcbiAgICAgICAgcHJpdmF0ZSBpbnQ/IGN1cnJlbnRTZWVkID0gbnVsbDtcclxuXHJcbiAgICAgICAgcHVibGljIFRyZWVEcmF3ZXIoXHJcbiAgICAgICAgICAgIEhUTUxDYW52YXNFbGVtZW50IGNhbnZhcyxcclxuICAgICAgICAgICAgSFRNTEltYWdlRWxlbWVudCB3YXRlcixcclxuICAgICAgICAgICAgSFRNTEltYWdlRWxlbWVudCByZXNldCxcclxuICAgICAgICAgICAgU2hhcmVkRHJhd2luZ1N0YXRlIHNoYXJlZERyYXdpbmdTdGF0ZVxyXG4gICAgICAgIClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMud2F0ZXIgPSB3YXRlciA/PyAoKFN5c3RlbS5GdW5jPEhUTUxJbWFnZUVsZW1lbnQ+KSgoKT0+e3Rocm93IG5ldyBBcmd1bWVudE51bGxFeGNlcHRpb24oXCJ3YXRlclwiKTt9KSkoKTtcclxuICAgICAgICAgICAgdGhpcy5yZXNldCA9IHJlc2V0ID8/ICgoU3lzdGVtLkZ1bmM8SFRNTEltYWdlRWxlbWVudD4pKCgpPT57dGhyb3cgbmV3IEFyZ3VtZW50TnVsbEV4Y2VwdGlvbihcInJlc2V0XCIpO30pKSgpO1xyXG4gICAgICAgICAgICB0aGlzLnNoYXJlZERyYXdpbmdTdGF0ZSA9IHNoYXJlZERyYXdpbmdTdGF0ZSA/PyAoKFN5c3RlbS5GdW5jPFNoYXJlZERyYXdpbmdTdGF0ZT4pKCgpPT57dGhyb3cgbmV3IEFyZ3VtZW50TnVsbEV4Y2VwdGlvbihcInNoYXJlZERyYXdpbmdTdGF0ZVwiKTt9KSkoKTtcclxuXHJcbiAgICAgICAgICAgIGNhbnZhcy5XaWR0aCA9IENhbnZhc1dpZHRoO1xyXG4gICAgICAgICAgICBjYW52YXMuSGVpZ2h0ID0gQ2FudmFzSGVpZ2h0O1xyXG5cclxuICAgICAgICAgICAgY3R4ID0gY2FudmFzLkdldENvbnRleHQoQ2FudmFzVHlwZXMuQ2FudmFzQ29udGV4dDJEVHlwZS5DYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpO1xyXG5cclxuICAgICAgICAgICAgdHJlZURyYXdpbmdDb250ZXh0ID0gbmV3IFRyZWVEcmF3aW5nQ29udGV4dChjdHgpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFNjYWxlRmFjdG9yID0gU2NhbGVGYWN0b3IsXHJcbiAgICAgICAgICAgICAgICBTdGFydFggPSBDYW52YXNXaWR0aCAvIDIsXHJcbiAgICAgICAgICAgICAgICBTdGFydFkgPSBUcmVlWU9mZnNldCxcclxuICAgICAgICAgICAgICAgIExlYWZMaW1pdCA9IDAuMDJcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgdm9pZCBVcGRhdGVTZWVkKGludCBuZXdTZWVkKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIHRyZWVSbmRTb3VyY2UgPSBuZXcgUmFuZG9tV3JhcHBlcihuZXdTZWVkKTtcclxuICAgICAgICAgICAgdmFyIHRyZWVCdWlsZGVyID0gbmV3IFRyZWVCdWlsZGVyKHRyZWVSbmRTb3VyY2UpO1xyXG5cclxuICAgICAgICAgICAgdHJ1bmsgPSB0cmVlQnVpbGRlci5CdWlsZFRyZWUoKTtcclxuICAgICAgICAgICAgZ3Jhc3NSYW5kb20gPSBuZXcgUmFuZG9tV3JhcHBlcihuZXdTZWVkKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgYm9vbCB3YXRlckluZm9XYXNTaG93biA9IGZhbHNlO1xyXG4gICAgICAgIHByaXZhdGUgYm9vbCB3YXRlckluZm9EZWFjdGl2YXRlZCA9IGZhbHNlO1xyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBEcmF3KClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmIChzaGFyZWREcmF3aW5nU3RhdGUuU2VlZCAhPSBjdXJyZW50U2VlZClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVXBkYXRlU2VlZChzaGFyZWREcmF3aW5nU3RhdGUuU2VlZCk7XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50U2VlZCA9IHNoYXJlZERyYXdpbmdTdGF0ZS5TZWVkO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoY3VycmVudFNlZWQgPT0gbnVsbClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBncmFzc1JhbmRvbS5SZXNldCgpO1xyXG5cclxuICAgICAgICAgICAgY3R4LkZpbGxTdHlsZSA9IFNreUNvbG9yO1xyXG4gICAgICAgICAgICBjdHguQ2xlYXJSZWN0KDAsIDAsIDUxMiwgNTEyKTtcclxuICAgICAgICAgICAgY3R4LkZpbGxSZWN0KDAsIDAsIDUxMiwgNTEyKTtcclxuXHJcbiAgICAgICAgICAgIHRyZWVEcmF3aW5nQ29udGV4dC5Hcm93dGhGYWN0b3IgPSBFYXNpbmdIZWxwZXIuRWFzZU91dFF1YWQoc2hhcmVkRHJhd2luZ1N0YXRlLkdyb3d0aENvbnRyb2wgKiAwLjc1ICsgMC4yNSk7XHJcbiAgICAgICAgICAgIHRyZWVEcmF3aW5nQ29udGV4dC5MZWFmRmFjdG9yID0gc2hhcmVkRHJhd2luZ1N0YXRlLlRoaWNrbmVzc0NvbnRyb2wgKiAwLjk7XHJcbiAgICAgICAgICAgIHRyZWVEcmF3aW5nQ29udGV4dC5Jc0RlYWQgPSBzaGFyZWREcmF3aW5nU3RhdGUuSXNEZWFkO1xyXG5cclxuICAgICAgICAgICAgdmFyIGdyYXNzSGVpZ2h0ID0gVHJlZVlPZmZzZXQgLSA1MDtcclxuICAgICAgICAgICAgY3R4LkZpbGxTdHlsZSA9IEdyYXNzQmFja2dyb3VuZENvbG9yO1xyXG4gICAgICAgICAgICBjdHguRmlsbFJlY3QoMCwgZ3Jhc3NIZWlnaHQsIENhbnZhc1dpZHRoLCBDYW52YXNIZWlnaHQgLSBncmFzc0hlaWdodCk7XHJcblxyXG4gICAgICAgICAgICB2YXIgZ3Jhc3NGb3JlZ3JvdW5kTGltaXQgPSBUcmVlWU9mZnNldCAtIDIwO1xyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgeSA9IGdyYXNzSGVpZ2h0IC0gMTA7IHkgPCBncmFzc0ZvcmVncm91bmRMaW1pdDsgeSArPSA1KVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBEcmF3R3Jhc3MoeSwgNTEyKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdHJlZURyYXdpbmdDb250ZXh0LkRyYXdUcmVlKHRydW5rKTtcclxuXHJcbiAgICAgICAgICAgIGZvciAodmFyIHkgPSBncmFzc0ZvcmVncm91bmRMaW1pdDsgeSA8IENhbnZhc0hlaWdodDsgeSArPSA1KVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBEcmF3R3Jhc3MoeSwgNTEyKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgRHJhd1dhdGVySFVEKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHZvaWQgRHJhd1dhdGVySFVEKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIC8vIGRyYXcgaHVkXHJcbiAgICAgICAgICAgIHZhciBoZWlnaHQgPSAzMDtcclxuICAgICAgICAgICAgdmFyIG1hcmdpbiA9IDEwO1xyXG4gICAgICAgICAgICB2YXIgbWFyZ2luTGVmdCA9IDUwO1xyXG4gICAgICAgICAgICB2YXIgbWFyZ2luQm90dG9tID0gMjA7XHJcbiAgICAgICAgICAgIHZhciBwYWRkaW5nID0gNTtcclxuXHJcbiAgICAgICAgICAgIHZhciB3YXRlclByZWRpdGlvbiA9IDA7XHJcblxyXG4gICAgICAgICAgICBpZiAoc2hhcmVkRHJhd2luZ1N0YXRlLldhdGVyQW1vdW50ICsgc2hhcmVkRHJhd2luZ1N0YXRlLldhdGVyRGVsdGEgPiAxKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB3YXRlclByZWRpdGlvbiA9IDE7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICghc2hhcmVkRHJhd2luZ1N0YXRlLklzRGVhZClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgLy8gd2hpdGUgaHVkIGJnXHJcbiAgICAgICAgICAgICAgICBjdHguRmlsbFN0eWxlID0gXCIjQjJGRkZGNjBcIjtcclxuICAgICAgICAgICAgICAgIGN0eC5GaWxsUmVjdCgwICsgbWFyZ2luTGVmdCwgQ2FudmFzSGVpZ2h0IC0gbWFyZ2luQm90dG9tIC0gMiAqIHBhZGRpbmcgLSBoZWlnaHQsIENhbnZhc1dpZHRoIC0gbWFyZ2luIC0gbWFyZ2luTGVmdCwgaGVpZ2h0ICsgMiAqIHBhZGRpbmcpO1xyXG5cclxuICAgICAgICAgICAgICAgIGN0eC5GaWxsU3R5bGUgPSBcIiMwMDc3QkU4MFwiO1xyXG4gICAgICAgICAgICAgICAgY3R4LkZpbGxSZWN0KDAgKyBtYXJnaW5MZWZ0ICsgcGFkZGluZywgQ2FudmFzSGVpZ2h0IC0gbWFyZ2luQm90dG9tIC0gcGFkZGluZyAtIGhlaWdodCwgKENhbnZhc1dpZHRoIC0gMiAqIHBhZGRpbmcgLSBtYXJnaW4gLSBtYXJnaW5MZWZ0KSAqIHdhdGVyUHJlZGl0aW9uLCBoZWlnaHQpO1xyXG5cclxuICAgICAgICAgICAgICAgIGN0eC5GaWxsU3R5bGUgPSBcIiMwMDc3QkVcIjtcclxuICAgICAgICAgICAgICAgIGN0eC5GaWxsUmVjdCgwICsgbWFyZ2luTGVmdCArIHBhZGRpbmcsIENhbnZhc0hlaWdodCAtIG1hcmdpbkJvdHRvbSAtIHBhZGRpbmcgLSBoZWlnaHQsIChpbnQpKChDYW52YXNXaWR0aCAtIDIgKiBwYWRkaW5nIC0gbWFyZ2luIC0gbWFyZ2luTGVmdCkgKiBzaGFyZWREcmF3aW5nU3RhdGUuV2F0ZXJBbW91bnQpLCBoZWlnaHQpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YXIgaWNvbiA9IHdhdGVyO1xyXG4gICAgICAgICAgICB2YXIgaWNvbkxlZnQgPSA1O1xyXG5cclxuICAgICAgICAgICAgaWYgKHNoYXJlZERyYXdpbmdTdGF0ZS5Jc0RlYWQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGljb25MZWZ0ID0gMjA7XHJcbiAgICAgICAgICAgICAgICBpY29uID0gcmVzZXQ7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGN0eC5JbWFnZVNtb290aGluZ0VuYWJsZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICBjdHguRHJhd0ltYWdlKGljb24sIGljb25MZWZ0LCBDYW52YXNIZWlnaHQgLSA2NCAtIDE1LCA2NGQsIDY0ZCk7XHJcblxyXG4gICAgICAgICAgICBjdHguRmlsbFN0eWxlID0gXCIjMDAwXCI7XHJcbiAgICAgICAgICAgIGN0eC5Gb250ID0gXCJib2xkIDE2cHggQXJpYWwsIHNhbnMtc2VyaWZcIjtcclxuXHJcbiAgICAgICAgICAgIHZhciB0ZXh0ID0gXCJcIjtcclxuXHJcbiAgICAgICAgICAgIGlmICghc2hhcmVkRHJhd2luZ1N0YXRlLklzRGVhZClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdmFyIGxhc3RXYXRlcmluZm8gPSB3YXRlckluZm9XYXNTaG93bjtcclxuICAgICAgICAgICAgICAgIHdhdGVySW5mb1dhc1Nob3duID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKChzaGFyZWREcmF3aW5nU3RhdGUuV2F0ZXJBbW91bnQgPCAwLjUgJiYgIXdhdGVySW5mb0RlYWN0aXZhdGVkKSB8fCBzaGFyZWREcmF3aW5nU3RhdGUuV2F0ZXJBbW91bnQgPCAwLjAwMSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB0ZXh0ID0gXCLir4cgY2xpY2sgdG8gd2F0ZXIgeW91ciB0cmVlXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgd2F0ZXJJbmZvV2FzU2hvd24gPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoc2hhcmVkRHJhd2luZ1N0YXRlLldhdGVyQW1vdW50ID4gMC45OTkpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dCA9IFwic3dhbXBlZFwiO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChsYXN0V2F0ZXJpbmZvICYmICF3YXRlckluZm9XYXNTaG93bilcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB3YXRlckluZm9EZWFjdGl2YXRlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBjdHguRm9udCA9IFwiYm9sZCAyNHB4IEFyaWFsLCBzYW5zLXNlcmlmXCI7XHJcbiAgICAgICAgICAgICAgICBtYXJnaW5MZWZ0ICs9IDMwO1xyXG4gICAgICAgICAgICAgICAgLy90ZXh0ID0gXCLir4cgY2xpY2sgdG8gcmVzdGFydFwiO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjdHguRmlsbFRleHQodGV4dCwgbWFyZ2luTGVmdCArIHBhZGRpbmcgKyAxNSwgQ2FudmFzSGVpZ2h0IC0gbWFyZ2luQm90dG9tIC0gcGFkZGluZyAtIDEwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgdm9pZCBEcmF3R3Jhc3MoaW50IHksIGludCBhbW91bnQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgZ3Jhc3NTY2FsZSA9IDAuMiAqIFNjYWxlRmFjdG9yO1xyXG5cclxuICAgICAgICAgICAgY3R4LlN0cm9rZVN0eWxlID0gR3Jhc3NDb2xvcjtcclxuICAgICAgICAgICAgY3R4LkxpbmVXaWR0aCA9IGdyYXNzU2NhbGUgKiAwLjAyNTtcclxuXHJcbiAgICAgICAgICAgIGN0eC5CZWdpblBhdGgoKTtcclxuXHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYW1vdW50OyBpKyspXHJcbiAgICAgICAgICAgIHtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgeCA9IGdyYXNzUmFuZG9tLk5leHREb3VibGUoKSAqIENhbnZhc1dpZHRoO1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBvZmZzZXR4ID0gZ3Jhc3NSYW5kb20uTmV4dERvdWJsZSgpIC0gMC41O1xyXG4gICAgICAgICAgICAgICAgdmFyIG9mZnNldFkgPSBncmFzc1JhbmRvbS5OZXh0RG91YmxlKCkgLSAwLjU7XHJcbiAgICAgICAgICAgICAgICB2YXIgaGVpZ2h0ID0gZ3Jhc3NSYW5kb20uTmV4dERvdWJsZSgpICogMC43ICsgMC4zO1xyXG5cclxuICAgICAgICAgICAgICAgIGN0eC5Nb3ZlVG8oeCwgeSArIG9mZnNldFkgKiBncmFzc1NjYWxlKTtcclxuICAgICAgICAgICAgICAgIGN0eC5MaW5lVG8oeCArIG9mZnNldHggKiBncmFzc1NjYWxlLCB5ICsgb2Zmc2V0WSAqIGdyYXNzU2NhbGUgKyBoZWlnaHQgKiBncmFzc1NjYWxlKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY3R4LkNsb3NlUGF0aCgpO1xyXG4gICAgICAgICAgICBjdHguU3Ryb2tlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIFN5c3RlbS5UaHJlYWRpbmcuVGFza3M7XHJcblxyXG5uYW1lc3BhY2UgV2lzY2hpLkxENDYuS2VlcEl0QWxpdmUuQnJpZGdlTmV0XHJcbntcclxuICAgIHB1YmxpYyBzdGF0aWMgY2xhc3MgVGFza1hcclxuICAgIHtcclxuICAgICAgICAvLyBXb3JrYXJvdW5kIGZvciBtaXNzaW5nIFRhc2suQ29tcGxldGVkVGFza1xyXG4gICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9icmlkZ2Vkb3RuZXQvQnJpZGdlL2lzc3Vlcy8zMjAxXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBUYXNrIENvbXBsZXRlZFRhc2sgeyBnZXQ7IHByaXZhdGUgc2V0OyB9XHJcblxuICAgIFxucHJpdmF0ZSBzdGF0aWMgVGFzayBfX1Byb3BlcnR5X19Jbml0aWFsaXplcl9fQ29tcGxldGVkVGFzaz1UYXNrLkRlbGF5KDApO31cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIFN5c3RlbS5UaHJlYWRpbmcuVGFza3M7XHJcblxyXG5uYW1lc3BhY2UgV2lzY2hpLkxENDYuS2VlcEl0QWxpdmUuQnJpZGdlTmV0XHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBUcmVlQXBwQ29udGV4dFxyXG4gICAge1xyXG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgSUNsb2NrIGNsb2NrO1xyXG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgVHJlZUVudmlyb25tZW50Q29uZmlnIGNvbmZpZztcclxuICAgICAgICBwcml2YXRlIHJlYWRvbmx5IFRyZWVTdGF0ZVN0b3JlIHRyZWVTdGF0ZVN0b3JlO1xyXG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgVHJlZVN0YXRlRmFjdG9yeSB0cmVlU3RhdGVGYWN0b3J5O1xyXG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgU2hhcmVkRHJhd2luZ1N0YXRlIHNoYXJlZERyYXdpbmdTdGF0ZTtcclxuXHJcbiAgICAgICAgcHVibGljIFRyZWVBcHBDb250ZXh0KFxyXG4gICAgICAgICAgICBJQ2xvY2sgY2xvY2ssXHJcbiAgICAgICAgICAgIFRyZWVFbnZpcm9ubWVudENvbmZpZyBjb25maWcsXHJcbiAgICAgICAgICAgIFRyZWVTdGF0ZVN0b3JlIHRyZWVTdGF0ZVN0b3JlLFxyXG4gICAgICAgICAgICBUcmVlU3RhdGVGYWN0b3J5IHRyZWVTdGF0ZUZhY3RvcnksXHJcbiAgICAgICAgICAgIFNoYXJlZERyYXdpbmdTdGF0ZSBzaGFyZWREcmF3aW5nU3RhdGVcclxuICAgICAgICApXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLmNsb2NrID0gY2xvY2sgPz8gKChTeXN0ZW0uRnVuYzxJQ2xvY2s+KSgoKT0+e3Rocm93IG5ldyBBcmd1bWVudE51bGxFeGNlcHRpb24oXCJjbG9ja1wiKTt9KSkoKTtcclxuICAgICAgICAgICAgdGhpcy5jb25maWcgPSBjb25maWcgPz8gKChTeXN0ZW0uRnVuYzxUcmVlRW52aXJvbm1lbnRDb25maWc+KSgoKT0+e3Rocm93IG5ldyBBcmd1bWVudE51bGxFeGNlcHRpb24oXCJjb25maWdcIik7fSkpKCk7XHJcbiAgICAgICAgICAgIHRoaXMudHJlZVN0YXRlU3RvcmUgPSB0cmVlU3RhdGVTdG9yZSA/PyAoKFN5c3RlbS5GdW5jPFRyZWVTdGF0ZVN0b3JlPikoKCk9Pnt0aHJvdyBuZXcgQXJndW1lbnROdWxsRXhjZXB0aW9uKFwidHJlZVN0YXRlU3RvcmVcIik7fSkpKCk7XHJcbiAgICAgICAgICAgIHRoaXMudHJlZVN0YXRlRmFjdG9yeSA9IHRyZWVTdGF0ZUZhY3RvcnkgPz8gKChTeXN0ZW0uRnVuYzxUcmVlU3RhdGVGYWN0b3J5PikoKCk9Pnt0aHJvdyBuZXcgQXJndW1lbnROdWxsRXhjZXB0aW9uKFwidHJlZVN0YXRlRmFjdG9yeVwiKTt9KSkoKTtcclxuICAgICAgICAgICAgdGhpcy5zaGFyZWREcmF3aW5nU3RhdGUgPSBzaGFyZWREcmF3aW5nU3RhdGUgPz8gKChTeXN0ZW0uRnVuYzxTaGFyZWREcmF3aW5nU3RhdGU+KSgoKT0+e3Rocm93IG5ldyBBcmd1bWVudE51bGxFeGNlcHRpb24oXCJzaGFyZWREcmF3aW5nU3RhdGVcIik7fSkpKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgVHJlZUJlaGF2aW91ckVuZ2luZSBUcmVlQmVoYXZpb3VyIHsgZ2V0OyBwcml2YXRlIHNldDsgfVxyXG5cclxuICAgICAgICBwdWJsaWMgYXN5bmMgVGFzayBJbml0aWFsaXplQXN5bmMoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIHN0YXRlID0gYXdhaXQgdHJlZVN0YXRlU3RvcmUuR2V0KCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoc3RhdGUgPT0gbnVsbClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgc3RhdGUgPSB0cmVlU3RhdGVGYWN0b3J5LkNyZWF0ZVRyZWUoKTtcclxuICAgICAgICAgICAgICAgIGF3YWl0IHRyZWVTdGF0ZVN0b3JlLlNldChzdGF0ZSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIFRyZWVCZWhhdmlvdXIgPSBuZXcgVHJlZUJlaGF2aW91ckVuZ2luZShjb25maWcsIHN0YXRlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBhc3luYyBUYXNrIFJlc2V0VHJlZUFzeW5jKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBzdGF0ZSA9IHRyZWVTdGF0ZUZhY3RvcnkuQ3JlYXRlVHJlZSgpO1xyXG4gICAgICAgICAgICBhd2FpdCB0cmVlU3RhdGVTdG9yZS5TZXQoc3RhdGUpO1xyXG4gICAgICAgICAgICBUcmVlQmVoYXZpb3VyID0gbmV3IFRyZWVCZWhhdmlvdXJFbmdpbmUoY29uZmlnLCBzdGF0ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBVcGRhdGVHYW1lU3RhdGUoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgVHJlZUJlaGF2aW91ci5VcGRhdGUoY2xvY2suTm93KCkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgVXBkYXRlUHJlUmVuZGVyKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHNoYXJlZERyYXdpbmdTdGF0ZS5Hcm93dGhDb250cm9sID0gVHJlZUJlaGF2aW91ci5UcmVlU3RhdGUuR3Jvd3RoO1xyXG4gICAgICAgICAgICBzaGFyZWREcmF3aW5nU3RhdGUuV2F0ZXJBbW91bnQgPSBNYXRoLk1pbigxLCBUcmVlQmVoYXZpb3VyLlRyZWVTdGF0ZS5XYXRlckxldmVsKTtcclxuICAgICAgICAgICAgc2hhcmVkRHJhd2luZ1N0YXRlLlRoaWNrbmVzc0NvbnRyb2wgPSBUcmVlQmVoYXZpb3VyLlRyZWVTdGF0ZS5IZWFsdGg7XHJcbiAgICAgICAgICAgIHNoYXJlZERyYXdpbmdTdGF0ZS5XYXRlckRlbHRhID0gVHJlZUJlaGF2aW91ci5XYXRlckRlbHRhO1xyXG4gICAgICAgICAgICBzaGFyZWREcmF3aW5nU3RhdGUuSXNEZWFkID0gVHJlZUJlaGF2aW91ci5UcmVlU3RhdGUuSGVhbHRoID09IDA7XHJcbiAgICAgICAgICAgIHNoYXJlZERyYXdpbmdTdGF0ZS5TZWVkID0gVHJlZUJlaGF2aW91ci5UcmVlU3RhdGUuU2VlZDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBhc3luYyBUYXNrIFdhdGVyQXN5bmMoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgVHJlZUJlaGF2aW91ci5XYXRlcigpO1xyXG4gICAgICAgICAgICBhd2FpdCB0cmVlU3RhdGVTdG9yZS5TZXQoVHJlZUJlaGF2aW91ci5UcmVlU3RhdGUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIGFzeW5jIFRhc2sgQXV0b1NhdmUoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgYXdhaXQgdHJlZVN0YXRlU3RvcmUuU2V0KFRyZWVCZWhhdmlvdXIuVHJlZVN0YXRlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwibmFtZXNwYWNlIFdpc2NoaS5MRDQ2LktlZXBJdEFsaXZlLkJyaWRnZU5ldFxyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgVHJlZUJlaGF2aW91ckVuZ2luZVxyXG4gICAge1xyXG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgUmFuZG9tV3JhcHBlciBybmRTb3VyY2U7XHJcbiAgICAgICAgcHJpdmF0ZSByZWFkb25seSBUcmVlRW52aXJvbm1lbnRDb25maWcgY29uZmlnO1xyXG5cclxuICAgICAgICBwdWJsaWMgVHJlZUJlaGF2aW91ckVuZ2luZShUcmVlRW52aXJvbm1lbnRDb25maWcgY29uZmlnLCBUcmVlU3RhdGUgdHJlZVN0YXRlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5jb25maWcgPSBjb25maWcgPz8gKChTeXN0ZW0uRnVuYzxUcmVlRW52aXJvbm1lbnRDb25maWc+KSgoKT0+e3Rocm93IG5ldyBTeXN0ZW0uQXJndW1lbnROdWxsRXhjZXB0aW9uKFwiY29uZmlnXCIpO30pKSgpO1xyXG4gICAgICAgICAgICB0aGlzLlRyZWVTdGF0ZSA9IHRyZWVTdGF0ZSA/PyAoKFN5c3RlbS5GdW5jPFRyZWVTdGF0ZT4pKCgpPT57dGhyb3cgbmV3IFN5c3RlbS5Bcmd1bWVudE51bGxFeGNlcHRpb24oXCJ0cmVlU3RhdGVcIik7fSkpKCk7XHJcblxyXG4gICAgICAgICAgICBXYXRlckRlbHRhID0gMC4xMjU7XHJcbiAgICAgICAgICAgIHJuZFNvdXJjZSA9IG5ldyBSYW5kb21XcmFwcGVyKHRyZWVTdGF0ZS5TZWVkKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBkb3VibGUgV2F0ZXJEZWx0YSB7IGdldDsgcHJpdmF0ZSBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgVHJlZVN0YXRlIFRyZWVTdGF0ZSB7IGdldDsgcHJpdmF0ZSBzZXQ7IH1cclxucHJpdmF0ZSBib29sIElzSGVhbHRoeVxyXG57XHJcbiAgICBnZXRcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gVHJlZVN0YXRlLldhdGVyTGV2ZWwgPiAwLjAwMSAmJiBUcmVlU3RhdGUuV2F0ZXJMZXZlbCA8PSAxO1xyXG4gICAgfVxyXG59XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIFdhdGVyKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFRyZWVTdGF0ZS5XYXRlckxldmVsICs9IFdhdGVyRGVsdGE7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBVcGRhdGUoZG91YmxlIG5vdylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciB0YXJnZXRUaWNrcyA9IChpbnQpKChub3cgLSBUcmVlU3RhdGUuU3RhcnRUaW1lc3RhbXApIC8gY29uZmlnLk1zVGlja1JhdGUpO1xyXG4gICAgICAgICAgICB2YXIgZGVsdGEgPSB0YXJnZXRUaWNrcyAtIFRyZWVTdGF0ZS5UaWNrcztcclxuXHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGVsdGE7IGkrKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVGljaygpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChUcmVlU3RhdGUuSGVhbHRoIDw9IDApXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gc3RvcCBwcm9jZXNzaW5nIHRpY2tzLCB0cmVlIGlzIGRlYWQgYWxyZWFkeS5cclxuICAgICAgICAgICAgICAgICAgICAvLyBUaGlzIHByZXZlbnRzIGxhZyBpZiB0aGUgdHJlZSB3YXNuJ3Qgb3BlbmVkIGZvciBhIGxvbmcgdGltZVxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBUcmVlU3RhdGUuTGFzdEV2ZW50VGltZXN0YW1wID0gbm93O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSB2b2lkIFRpY2soKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgVHJlZVN0YXRlLlRpY2tzKys7XHJcblxyXG4gICAgICAgICAgICBHcm93dGhUaWNrKCk7XHJcbiAgICAgICAgICAgIFdhdGVyVGljaygpO1xyXG4gICAgICAgICAgICBIZWFsdGhUaWNrKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHZvaWQgR3Jvd3RoVGljaygpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAoVHJlZVN0YXRlLkdyb3d0aCA+PSAxKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBUcmVlU3RhdGUuR3Jvd3RoID0gMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFRyZWVTdGF0ZS5Hcm93dGggKz0gY29uZmlnLk1heEdyb3d0aFJhdGUgKiBUcmVlU3RhdGUuSGVhbHRoO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHZvaWQgV2F0ZXJUaWNrKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciB3RGVsdGEgPSBjb25maWcuTWF4V2F0ZXJSYXRlIC0gY29uZmlnLk1pbldhdGVyUmF0ZTtcclxuICAgICAgICAgICAgdmFyIHdhdGVyQW1vdW50ID0gcm5kU291cmNlLk5leHREb3VibGUoKSAqIHdEZWx0YSArIGNvbmZpZy5NaW5XYXRlclJhdGU7XHJcbiAgICAgICAgICAgIFRyZWVTdGF0ZS5XYXRlckxldmVsIC09IHdhdGVyQW1vdW50O1xyXG5cclxuICAgICAgICAgICAgaWYgKFRyZWVTdGF0ZS5XYXRlckxldmVsIDwgMClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVHJlZVN0YXRlLldhdGVyTGV2ZWwgPSAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHZvaWQgSGVhbHRoVGljaygpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAoVHJlZVN0YXRlLkhlYWx0aCA8PSAwKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBUcmVlU3RhdGUuSGVhbHRoID0gMDtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKElzSGVhbHRoeSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVHJlZVN0YXRlLkhlYWx0aCArPSBjb25maWcuSGVhbFJhdGU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBUcmVlU3RhdGUuSGVhbHRoIC09IGNvbmZpZy5IYXJtUmF0ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKFRyZWVTdGF0ZS5IZWFsdGggPCAwKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBUcmVlU3RhdGUuSGVhbHRoID0gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChUcmVlU3RhdGUuSGVhbHRoID4gMSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgVHJlZVN0YXRlLkhlYWx0aCA9IDE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgQnJpZGdlLkh0bWw1O1xyXG51c2luZyBTeXN0ZW07XHJcblxyXG5uYW1lc3BhY2UgV2lzY2hpLkxENDYuS2VlcEl0QWxpdmUuQnJpZGdlTmV0XHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBUcmVlRHJhd2luZ0NvbnRleHRcclxuICAgIHtcclxuICAgICAgICBwcml2YXRlIGNvbnN0IGRvdWJsZSBUQVUgPSA2LjI4MzE4NTMwNzE3OTU4NjI7XHJcblxyXG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEIGN0eDtcclxuXHJcbiAgICAgICAgcHVibGljIFRyZWVEcmF3aW5nQ29udGV4dChDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgY3R4KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5jdHggPSBjdHggPz8gKChTeXN0ZW0uRnVuYzxDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ+KSgoKT0+e3Rocm93IG5ldyBBcmd1bWVudE51bGxFeGNlcHRpb24oXCJjdHhcIik7fSkpKCk7XHJcbiAgICAgICAgfVxyXG5wcml2YXRlIGludCBEZXB0aExpbWl0XHJcbntcclxuICAgIGdldFxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiAxMjtcclxuICAgIH1cclxufVxyXG4gICAgICAgIHB1YmxpYyBkb3VibGUgR3Jvd3RoRmFjdG9yIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgZG91YmxlIFNjYWxlRmFjdG9yIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgZG91YmxlIExlYWZMaW1pdCB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIGRvdWJsZSBTdGFydFggeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBkb3VibGUgU3RhcnRZIHsgZ2V0OyBzZXQ7IH1cclxucHJpdmF0ZSBkb3VibGUgVGhpY2tuZXNzTGltaXRcclxue1xyXG4gICAgZ2V0XHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIExlYWZMaW1pdCAqICgxIC0gTGVhZkZhY3Rvcik7XHJcbiAgICB9XHJcbn0gICAgICAgIHB1YmxpYyBkb3VibGUgTGVhZkZhY3RvciB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIGJvb2wgSXNEZWFkIHsgZ2V0OyBzZXQ7IH1cclxucHJpdmF0ZSBzdHJpbmcgQnJhbmNoQ29sb3Jcclxue1xyXG4gICAgZ2V0XHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIElzRGVhZCA/IFwiIzAwMFwiIDogXCIjNDIxMjA4XCI7XHJcbiAgICB9XHJcbn1cclxuICAgICAgICBwdWJsaWMgdm9pZCBEcmF3VHJlZShUcmVlU2VnbWVudCB0cmVlVHJ1bmspXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAodHJlZVRydW5rID09IG51bGwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBBcmd1bWVudE51bGxFeGNlcHRpb24oXCJ0cmVlVHJ1bmtcIik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIERyYXdTZWdtZW50SW50ZXJuYWwodHJlZVRydW5rLCBTdGFydFgsIFN0YXJ0WSwgMC4yNSAqIFRBVSwgZG91YmxlLk5hTik7XHJcbiAgICAgICAgfVxyXG5wcml2YXRlIEZ1bmM8ZG91YmxlLCBkb3VibGU+IEVhc2VEZXB0aFxyXG57XHJcbiAgICBnZXRcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gRWFzaW5nSGVscGVyLkVhc2VJblF1YWRPZmZzZXQ7XHJcbiAgICB9XHJcbn1wcml2YXRlIEZ1bmM8ZG91YmxlLCBkb3VibGU+IEVhc2VUaGlja25lc3Ncclxue1xyXG4gICAgZ2V0XHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIEVhc2luZ0hlbHBlci5FYXNlSW5RdWFkT2Zmc2V0O1xyXG4gICAgfVxyXG59cHJpdmF0ZSBGdW5jPGRvdWJsZSwgZG91YmxlPiBFYXNlRGV2aWF0aW9uXHJcbntcclxuICAgIGdldFxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBFYXNpbmdIZWxwZXIuRWFzZUxpbmVhcjtcclxuICAgIH1cclxufVxyXG4gICAgICAgIHByaXZhdGUgdm9pZCBEcmF3U2VnbWVudEludGVybmFsKFRyZWVTZWdtZW50IGN1cnJlbnRTZWdtZW50LCBkb3VibGUgeCwgZG91YmxlIHksIGRvdWJsZSBsYXN0QnJhbmNoQWJzb2x1dGVBbmdsZSwgZG91YmxlIGxhc3RUaGlja25lc3MpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgZmxvYXRpbmdEZXB0aCA9IERlcHRoTGltaXQgKiBFYXNlRGVwdGgoR3Jvd3RoRmFjdG9yKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBsb3dlckRlcHRoID0gKGludClmbG9hdGluZ0RlcHRoO1xyXG4gICAgICAgICAgICB2YXIgdXBwZXJEZXB0aCA9IGxvd2VyRGVwdGggKyAxO1xyXG5cclxuICAgICAgICAgICAgaWYgKGN1cnJlbnRTZWdtZW50LkRlcHRoID4gdXBwZXJEZXB0aClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YXIgZGVwdGhMZW5ndGhTY2FsZSA9IE1hdGguTWF4KE1hdGguTWluKDEuMCwgZmxvYXRpbmdEZXB0aCAtIGN1cnJlbnRTZWdtZW50LkRlcHRoKSwgMCk7XHJcblxyXG4gICAgICAgICAgICB2YXIgZWZmZWN0aXZlRGV2aWF0aW9uQW5nbGUgPSBjdXJyZW50U2VnbWVudC5EZXZpYXRpb25BbmdsZSAqIChFYXNlRGV2aWF0aW9uKEdyb3d0aEZhY3RvcikgKiAwLjMgKyAwLjcpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGN1cnJlbnRCcmFuY2hBYnNvbHV0ZUFuZ2xlID0gbGFzdEJyYW5jaEFic29sdXRlQW5nbGUgKyBlZmZlY3RpdmVEZXZpYXRpb25BbmdsZTtcclxuICAgICAgICAgICAgdmFyIGxlbmd0aCA9IGN1cnJlbnRTZWdtZW50Lkxlbmd0aCAqIEdyb3d0aEZhY3RvciAqIGRlcHRoTGVuZ3RoU2NhbGU7XHJcblxyXG4gICAgICAgICAgICB2YXIgaW50ZXJuYWxUaGlja25lc3MgPSBjdXJyZW50U2VnbWVudC5UaGlja25lc3MgKiBHcm93dGhGYWN0b3IgKiBFYXNlVGhpY2tuZXNzKEdyb3d0aEZhY3RvcikgKiBkZXB0aExlbmd0aFNjYWxlO1xyXG5cclxuICAgICAgICAgICAgaWYgKGludGVybmFsVGhpY2tuZXNzIDwgVGhpY2tuZXNzTGltaXQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGludGVybmFsVGhpY2tuZXNzID4gTGVhZkxpbWl0KVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAvLyBicmFuY2hcclxuICAgICAgICAgICAgICAgIGN0eC5TdHJva2VTdHlsZSA9IEJyYW5jaENvbG9yO1xyXG4gICAgICAgICAgICAgICAgY3R4LkZpbGxTdHlsZSA9IEJyYW5jaENvbG9yO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgLy8gbGVhZlxyXG4gICAgICAgICAgICAgICAgY3R4LlN0cm9rZVN0eWxlID0gXCIjMjA2NDExXCI7XHJcbiAgICAgICAgICAgICAgICBjdHguRmlsbFN0eWxlID0gXCIjMjA2NDExXCI7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChkb3VibGUuSXNOYU4obGFzdFRoaWNrbmVzcykpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGxhc3RUaGlja25lc3MgPSBpbnRlcm5hbFRoaWNrbmVzcztcclxuICAgICAgICAgICAgfVxyXG5CcmlkZ2UuU2NyaXB0LkRlY29uc3RydWN0KERyYXdTZWdtZW50VG9DYW52YXMyKHgsIHksIGludGVybmFsVGhpY2tuZXNzLCBjdXJyZW50QnJhbmNoQWJzb2x1dGVBbmdsZSwgbGFzdFRoaWNrbmVzcywgbGFzdEJyYW5jaEFic29sdXRlQW5nbGUsIGxlbmd0aCksIG91dCB4LCBvdXQgeSk7XHJcblxyXG4gICAgICAgICAgICBmb3JlYWNoICh2YXIgYnJhbmNoIGluIGN1cnJlbnRTZWdtZW50LkJyYW5jaGVzKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBEcmF3U2VnbWVudEludGVybmFsKGJyYW5jaCwgeCwgeSwgY3VycmVudEJyYW5jaEFic29sdXRlQW5nbGUsIGludGVybmFsVGhpY2tuZXNzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBTeXN0ZW0uVmFsdWVUdXBsZTxkb3VibGUgLGRvdWJsZSA+IERyYXdTZWdtZW50VG9DYW52YXMoXHJcbiAgICAgICAgICAgIGRvdWJsZSB4LFxyXG4gICAgICAgICAgICBkb3VibGUgeSxcclxuICAgICAgICAgICAgZG91YmxlIHRoaWNrbmVzcyxcclxuICAgICAgICAgICAgZG91YmxlIGFic29sdXRlQW5nbGUsXHJcbiAgICAgICAgICAgIGRvdWJsZSBwcmV2aW91c1RoaWNrbmVzcyxcclxuICAgICAgICAgICAgZG91YmxlIHByZXZpb3VzQW5nbGUsXHJcbiAgICAgICAgICAgIGRvdWJsZSBsZW5ndGhcclxuICAgICAgICApXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjdHguQmVnaW5QYXRoKCk7XHJcbiAgICAgICAgICAgIGN0eC5Nb3ZlVG8oeCwgeSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgZHggPSBNYXRoLkNvcyhhYnNvbHV0ZUFuZ2xlKSAqIGxlbmd0aCAqIFNjYWxlRmFjdG9yO1xyXG4gICAgICAgICAgICB2YXIgZHkgPSBNYXRoLlNpbihhYnNvbHV0ZUFuZ2xlKSAqIGxlbmd0aCAqIFNjYWxlRmFjdG9yO1xyXG5cclxuICAgICAgICAgICAgeCArPSBkeDtcclxuICAgICAgICAgICAgeSArPSAtZHk7XHJcblxyXG4gICAgICAgICAgICBjdHguTGluZVRvKHgsIHkpO1xyXG4gICAgICAgICAgICBjdHguTGluZVdpZHRoID0gdGhpY2tuZXNzICogU2NhbGVGYWN0b3I7XHJcbiAgICAgICAgICAgIGN0eC5DbG9zZVBhdGgoKTtcclxuXHJcbiAgICAgICAgICAgIGN0eC5TdHJva2UoKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgU3lzdGVtLlZhbHVlVHVwbGU8ZG91YmxlLCBkb3VibGU+KHgsIHkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBTeXN0ZW0uVmFsdWVUdXBsZTxkb3VibGUgLGRvdWJsZSA+IERyYXdTZWdtZW50VG9DYW52YXMyKFxyXG4gICAgICAgICAgICBkb3VibGUgeCxcclxuICAgICAgICAgICAgZG91YmxlIHksXHJcbiAgICAgICAgICAgIGRvdWJsZSB0aGlja25lc3MsXHJcbiAgICAgICAgICAgIGRvdWJsZSBhYnNvbHV0ZUFuZ2xlLFxyXG4gICAgICAgICAgICBkb3VibGUgcHJldmlvdXNUaGlja25lc3MsXHJcbiAgICAgICAgICAgIGRvdWJsZSBwcmV2aW91c0FuZ2xlLFxyXG4gICAgICAgICAgICBkb3VibGUgbGVuZ3RoXHJcbiAgICAgICAgKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIGR4ID0gTWF0aC5Db3MoYWJzb2x1dGVBbmdsZSkgKiBsZW5ndGggKiBTY2FsZUZhY3RvcjtcclxuICAgICAgICAgICAgdmFyIGR5ID0gTWF0aC5TaW4oYWJzb2x1dGVBbmdsZSkgKiBsZW5ndGggKiBTY2FsZUZhY3RvcjtcclxuXHJcbiAgICAgICAgICAgIHZhciBuZXdYID0geCArIGR4O1xyXG4gICAgICAgICAgICB2YXIgbmV3WSA9IHkgLSBkeTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlja25lc3MgPiBMZWFmTGltaXQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIC8vIGNhbGMgb2xkIGF0dGFjaHBvaW50c1xyXG4gICAgICAgICAgICAgICAgdmFyIG9sZE5vcm1hbCA9IHByZXZpb3VzQW5nbGUgLSBUQVUgKiAwLjI1O1xyXG4gICAgICAgICAgICAgICAgdmFyIG9sZE5vcm1hbFggPSBNYXRoLkNvcyhvbGROb3JtYWwpICogcHJldmlvdXNUaGlja25lc3MgLyAyO1xyXG4gICAgICAgICAgICAgICAgdmFyIG9sZE5vcm1hbFkgPSAtTWF0aC5TaW4ob2xkTm9ybWFsKSAqIHByZXZpb3VzVGhpY2tuZXNzIC8gMjtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBjYWxjIG5ldyBhdHRhY2hwb2ludHNcclxuICAgICAgICAgICAgICAgIHZhciBuZXdOb3JtYWwgPSBhYnNvbHV0ZUFuZ2xlICsgVEFVICogMC4yNTtcclxuICAgICAgICAgICAgICAgIHZhciBuZXdOb3JtYWxYID0gTWF0aC5Db3MobmV3Tm9ybWFsKSAqIHRoaWNrbmVzcyAvIDI7XHJcbiAgICAgICAgICAgICAgICB2YXIgbmV3Tm9ybWFsWSA9IC1NYXRoLlNpbihuZXdOb3JtYWwpICogdGhpY2tuZXNzIC8gMjtcclxuXHJcbiAgICAgICAgICAgICAgICBjdHguQmVnaW5QYXRoKCk7XHJcbiAgICAgICAgICAgICAgICBjdHguTW92ZVRvKHggKyBvbGROb3JtYWxYICogU2NhbGVGYWN0b3IsIHkgKyBvbGROb3JtYWxZICogU2NhbGVGYWN0b3IpO1xyXG4gICAgICAgICAgICAgICAgY3R4LkxpbmVUbyhuZXdYIC0gbmV3Tm9ybWFsWCAqIFNjYWxlRmFjdG9yLCBuZXdZIC0gbmV3Tm9ybWFsWSAqIFNjYWxlRmFjdG9yKTtcclxuICAgICAgICAgICAgICAgIGN0eC5MaW5lVG8obmV3WCArIG5ld05vcm1hbFggKiBTY2FsZUZhY3RvciwgbmV3WSArIG5ld05vcm1hbFkgKiBTY2FsZUZhY3Rvcik7XHJcbiAgICAgICAgICAgICAgICBjdHguTGluZVRvKHggLSBvbGROb3JtYWxYICogU2NhbGVGYWN0b3IsIHkgLSBvbGROb3JtYWxZICogU2NhbGVGYWN0b3IpO1xyXG5cclxuICAgICAgICAgICAgICAgIGN0eC5DbG9zZVBhdGgoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvL2N0eC5TdHJva2UoKTtcclxuICAgICAgICAgICAgICAgIGN0eC5GaWxsKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgY3R4LkJlZ2luUGF0aCgpO1xyXG4gICAgICAgICAgICAgICAgY3R4LkFyYyhuZXdYLCBuZXdZLCB0aGlja25lc3MgLyAyICogU2NhbGVGYWN0b3IsIDAsIFRBVSk7XHJcbiAgICAgICAgICAgICAgICBjdHguQ2xvc2VQYXRoKCk7XHJcbiAgICAgICAgICAgICAgICBjdHguRmlsbCgpO1xyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGN0eC5CZWdpblBhdGgoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBjdHguTW92ZVRvKHgsIHkpO1xyXG4gICAgICAgICAgICAgICAgY3R4LkxpbmVUbyhuZXdYLCBuZXdZKTtcclxuICAgICAgICAgICAgICAgIGN0eC5MaW5lV2lkdGggPSB0aGlja25lc3MgKiBTY2FsZUZhY3RvcjtcclxuXHJcbiAgICAgICAgICAgICAgICBjdHguQ2xvc2VQYXRoKCk7XHJcbiAgICAgICAgICAgICAgICBjdHguU3Ryb2tlKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgU3lzdGVtLlZhbHVlVHVwbGU8ZG91YmxlLCBkb3VibGU+KG5ld1gsIG5ld1kpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJuYW1lc3BhY2UgV2lzY2hpLkxENDYuS2VlcEl0QWxpdmUuQnJpZGdlTmV0XHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBUcmVlRW52aXJvbm1lbnRDb25maWdcclxuXHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIFRyZWVFbnZpcm9ubWVudENvbmZpZyhcclxuICAgICAgICAgICAgZG91YmxlIG1heEdyb3d0aFJhdGUsXHJcbiAgICAgICAgICAgIGRvdWJsZSBtaW5XYXRlclJhdGUsXHJcbiAgICAgICAgICAgIGRvdWJsZSBtYXhXYXRlclJhdGUsXHJcbiAgICAgICAgICAgIGRvdWJsZSBoZWFsUmF0ZSxcclxuICAgICAgICAgICAgZG91YmxlIGhhcm1SYXRlLFxyXG4gICAgICAgICAgICBkb3VibGUgaW5pdGlhbFdhdGVyTGV2ZWwsXHJcbiAgICAgICAgICAgIGludCBtc1JlZnJlc2hSYXRlLFxyXG4gICAgICAgICAgICBpbnQgbXNUaWNrUmF0ZSxcclxuICAgICAgICAgICAgaW50IG1zQXV0b1NhdmUsXHJcbiAgICAgICAgICAgIHN0cmluZyBzZXR0aW5nUHJlZml4XHJcbiAgICAgICAgKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgTWF4R3Jvd3RoUmF0ZSA9IG1heEdyb3d0aFJhdGU7XHJcbiAgICAgICAgICAgIE1pbldhdGVyUmF0ZSA9IG1pbldhdGVyUmF0ZTtcclxuICAgICAgICAgICAgTWF4V2F0ZXJSYXRlID0gbWF4V2F0ZXJSYXRlO1xyXG4gICAgICAgICAgICBIZWFsUmF0ZSA9IGhlYWxSYXRlO1xyXG4gICAgICAgICAgICBIYXJtUmF0ZSA9IGhhcm1SYXRlO1xyXG4gICAgICAgICAgICBJbml0aWFsV2F0ZXJMZXZlbCA9IGluaXRpYWxXYXRlckxldmVsO1xyXG4gICAgICAgICAgICBNc1JlZnJlc2hSYXRlID0gbXNSZWZyZXNoUmF0ZTtcclxuICAgICAgICAgICAgTXNUaWNrUmF0ZSA9IG1zVGlja1JhdGU7XHJcbiAgICAgICAgICAgIE1zQXV0b1NhdmUgPSBtc0F1dG9TYXZlO1xyXG4gICAgICAgICAgICBTZXR0aW5nUHJlZml4ID0gc2V0dGluZ1ByZWZpeDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBkb3VibGUgTWF4R3Jvd3RoUmF0ZSB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIGRvdWJsZSBNaW5XYXRlclJhdGUgeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBkb3VibGUgTWF4V2F0ZXJSYXRlIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgZG91YmxlIEhlYWxSYXRlIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgZG91YmxlIEhhcm1SYXRlIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgZG91YmxlIEluaXRpYWxXYXRlckxldmVsIHsgZ2V0OyBwcml2YXRlIHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBpbnQgTXNSZWZyZXNoUmF0ZSB7IGdldDsgcHJpdmF0ZSBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgaW50IE1zVGlja1JhdGUgeyBnZXQ7IHByaXZhdGUgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIGludCBNc0F1dG9TYXZlIHsgZ2V0OyBwcml2YXRlIHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBzdHJpbmcgU2V0dGluZ1ByZWZpeCB7IGdldDsgcHJpdmF0ZSBzZXQ7IH1cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcblxyXG5uYW1lc3BhY2UgV2lzY2hpLkxENDYuS2VlcEl0QWxpdmUuQnJpZGdlTmV0XHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBUcmVlRW52aXJvbm1lbnRDb25maWdCdWlsZGVyXHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIFRpbWVTcGFuIEZ1bGxHcm93blRyZWUgeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBUaW1lU3BhbiBUaWNrUmF0ZSB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIFRpbWVTcGFuIFdhdGVyTWluIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgVGltZVNwYW4gV2F0ZXJNYXggeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBUaW1lU3BhbiBEdXJhdGlvblVudGlsRGVhZFdoZW5VbmhlYWx0aHkgeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBUaW1lU3BhbiBEdXJhdGlvblVudGlsRnVsbEhlYWx0aFdoZW5IZWFsdGh5IHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgVGltZVNwYW4gU2NyZWVuUmVmcmVzaFJhdGUgeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBkb3VibGUgSW5pdGlhbFdhdGVyTGV2ZWwgeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBzdHJpbmcgU2V0dGluZ1ByZWZpeCB7IGdldDsgc2V0OyB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBUcmVlRW52aXJvbm1lbnRDb25maWcgQnVpbGQoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBUcmVlRW52aXJvbm1lbnRDb25maWcoXHJcbiAgICAgICAgICAgICAgICBHZXRQZXJUaWNrVmFsdWUoRnVsbEdyb3duVHJlZSksXHJcbiAgICAgICAgICAgICAgICBHZXRQZXJUaWNrVmFsdWUoV2F0ZXJNaW4pLFxyXG4gICAgICAgICAgICAgICAgR2V0UGVyVGlja1ZhbHVlKFdhdGVyTWF4KSxcclxuICAgICAgICAgICAgICAgIEdldFBlclRpY2tWYWx1ZShEdXJhdGlvblVudGlsRnVsbEhlYWx0aFdoZW5IZWFsdGh5KSxcclxuICAgICAgICAgICAgICAgIEdldFBlclRpY2tWYWx1ZShEdXJhdGlvblVudGlsRGVhZFdoZW5VbmhlYWx0aHkpLFxyXG4gICAgICAgICAgICAgICAgSW5pdGlhbFdhdGVyTGV2ZWwsXHJcbiAgICAgICAgICAgICAgICAoaW50KU1hdGguUm91bmQoU2NyZWVuUmVmcmVzaFJhdGUuVG90YWxNaWxsaXNlY29uZHMpLFxyXG4gICAgICAgICAgICAgICAgKGludClNYXRoLlJvdW5kKFRpY2tSYXRlLlRvdGFsTWlsbGlzZWNvbmRzKSxcclxuICAgICAgICAgICAgICAgIDE1MDAwLFxyXG4gICAgICAgICAgICAgICAgU2V0dGluZ1ByZWZpeFxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBkb3VibGUgR2V0UGVyVGlja1ZhbHVlKFRpbWVTcGFuIHZhbHVlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuIDEuMCAvICh2YWx1ZS5Ub3RhbE1pbGxpc2Vjb25kcyAvIFRpY2tSYXRlLlRvdGFsTWlsbGlzZWNvbmRzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG5cclxubmFtZXNwYWNlIFdpc2NoaS5MRDQ2LktlZXBJdEFsaXZlLkJyaWRnZU5ldFxyXG57XHJcbiAgICBwdWJsaWMgc3RhdGljIGNsYXNzIFRyZWVFbnZpcm9ubWVudENvbmZpZ3NcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgc3RhdGljIFRyZWVFbnZpcm9ubWVudENvbmZpZyBEZWJ1ZyB7IGdldDsgcHJpdmF0ZSBzZXQ7IH1cclxuICAgICAgICAgICAgXHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgVHJlZUVudmlyb25tZW50Q29uZmlnIFJlbGVhc2UgeyBnZXQ7IHByaXZhdGUgc2V0OyB9XHJcbiAgICAgICAgICAgIFxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIFRyZWVFbnZpcm9ubWVudENvbmZpZyBOb25aZW5zTW9kZSB7IGdldDsgcHJpdmF0ZSBzZXQ7IH1cclxuICAgICAgICAgICAgXHJcblxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIFRyZWVFbnZpcm9ubWVudENvbmZpZyBMdWR1bURhcmU0NlRlc3QgeyBnZXQ7IHByaXZhdGUgc2V0OyB9XHJcbiAgICAgICAgICAgIFxyXG5cbiAgICBcbnByaXZhdGUgc3RhdGljIFRyZWVFbnZpcm9ubWVudENvbmZpZyBfX1Byb3BlcnR5X19Jbml0aWFsaXplcl9fRGVidWc9bmV3IFRyZWVFbnZpcm9ubWVudENvbmZpZ0J1aWxkZXIoKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBGdWxsR3Jvd25UcmVlID0gVGltZVNwYW4uRnJvbU1pbnV0ZXMoMTApLFxyXG4gICAgICAgICAgICAgICAgVGlja1JhdGUgPSBUaW1lU3Bhbi5Gcm9tTWlsbGlzZWNvbmRzKDEwKSxcclxuICAgICAgICAgICAgICAgIFdhdGVyTWF4ID0gVGltZVNwYW4uRnJvbVNlY29uZHMoMTYwKSxcclxuICAgICAgICAgICAgICAgIFdhdGVyTWluID0gVGltZVNwYW4uRnJvbVNlY29uZHMoNTApLFxyXG4gICAgICAgICAgICAgICAgU2NyZWVuUmVmcmVzaFJhdGUgPSBUaW1lU3Bhbi5Gcm9tTWlsbGlzZWNvbmRzKDEwMCksXHJcbiAgICAgICAgICAgICAgICBEdXJhdGlvblVudGlsRGVhZFdoZW5VbmhlYWx0aHkgPSBUaW1lU3Bhbi5Gcm9tU2Vjb25kcygxMDAwKSxcclxuICAgICAgICAgICAgICAgIER1cmF0aW9uVW50aWxGdWxsSGVhbHRoV2hlbkhlYWx0aHkgPSBUaW1lU3Bhbi5Gcm9tU2Vjb25kcygxMCksXHJcbiAgICAgICAgICAgICAgICBJbml0aWFsV2F0ZXJMZXZlbCA9IDEsXHJcbiAgICAgICAgICAgICAgICBTZXR0aW5nUHJlZml4ID0gXCJkZXZlbG9wXCJcclxuICAgICAgICAgICAgfS5CdWlsZCgpO3ByaXZhdGUgc3RhdGljIFRyZWVFbnZpcm9ubWVudENvbmZpZyBfX1Byb3BlcnR5X19Jbml0aWFsaXplcl9fUmVsZWFzZT1uZXcgVHJlZUVudmlyb25tZW50Q29uZmlnQnVpbGRlcigpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIEZ1bGxHcm93blRyZWUgPSBUaW1lU3Bhbi5Gcm9tRGF5cygzNjUgKiAyKSwgLy8gdHdvIHllYXJzXHJcbiAgICAgICAgICAgICAgICBUaWNrUmF0ZSA9IFRpbWVTcGFuLkZyb21NaW51dGVzKDE1KSxcclxuICAgICAgICAgICAgICAgIFdhdGVyTWF4ID0gVGltZVNwYW4uRnJvbURheXMoMTYpLFxyXG4gICAgICAgICAgICAgICAgV2F0ZXJNaW4gPSBUaW1lU3Bhbi5Gcm9tRGF5cyg1KSxcclxuICAgICAgICAgICAgICAgIFNjcmVlblJlZnJlc2hSYXRlID0gVGltZVNwYW4uRnJvbU1pbnV0ZXMoMSksXHJcbiAgICAgICAgICAgICAgICBEdXJhdGlvblVudGlsRGVhZFdoZW5VbmhlYWx0aHkgPSBUaW1lU3Bhbi5Gcm9tRGF5cygxNCksXHJcbiAgICAgICAgICAgICAgICBEdXJhdGlvblVudGlsRnVsbEhlYWx0aFdoZW5IZWFsdGh5ID0gVGltZVNwYW4uRnJvbURheXMoMTQpLFxyXG4gICAgICAgICAgICAgICAgSW5pdGlhbFdhdGVyTGV2ZWwgPSAwLjMsXHJcbiAgICAgICAgICAgICAgICBTZXR0aW5nUHJlZml4ID0gXCJib25zYWlcIlxyXG4gICAgICAgICAgICB9LkJ1aWxkKCk7cHJpdmF0ZSBzdGF0aWMgVHJlZUVudmlyb25tZW50Q29uZmlnIF9fUHJvcGVydHlfX0luaXRpYWxpemVyX19Ob25aZW5zTW9kZT1uZXcgVHJlZUVudmlyb25tZW50Q29uZmlnQnVpbGRlcigpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIEZ1bGxHcm93blRyZWUgPSBUaW1lU3Bhbi5Gcm9tTWludXRlcygxKSxcclxuICAgICAgICAgICAgICAgIFRpY2tSYXRlID0gVGltZVNwYW4uRnJvbU1pbGxpc2Vjb25kcygxMCksXHJcbiAgICAgICAgICAgICAgICBXYXRlck1heCA9IFRpbWVTcGFuLkZyb21TZWNvbmRzKDE2KSxcclxuICAgICAgICAgICAgICAgIFdhdGVyTWluID0gVGltZVNwYW4uRnJvbVNlY29uZHMoNSksXHJcbiAgICAgICAgICAgICAgICBTY3JlZW5SZWZyZXNoUmF0ZSA9IFRpbWVTcGFuLkZyb21NaWxsaXNlY29uZHMoMTAwKSxcclxuICAgICAgICAgICAgICAgIER1cmF0aW9uVW50aWxEZWFkV2hlblVuaGVhbHRoeSA9IFRpbWVTcGFuLkZyb21TZWNvbmRzKDEwKSxcclxuICAgICAgICAgICAgICAgIER1cmF0aW9uVW50aWxGdWxsSGVhbHRoV2hlbkhlYWx0aHkgPSBUaW1lU3Bhbi5Gcm9tU2Vjb25kcygxMCksXHJcbiAgICAgICAgICAgICAgICBJbml0aWFsV2F0ZXJMZXZlbCA9IDEsXHJcbiAgICAgICAgICAgICAgICBTZXR0aW5nUHJlZml4ID0gXCJkZWJ1Z1wiXHJcbiAgICAgICAgICAgIH0uQnVpbGQoKTtwcml2YXRlIHN0YXRpYyBUcmVlRW52aXJvbm1lbnRDb25maWcgX19Qcm9wZXJ0eV9fSW5pdGlhbGl6ZXJfX0x1ZHVtRGFyZTQ2VGVzdD1uZXcgVHJlZUVudmlyb25tZW50Q29uZmlnQnVpbGRlcigpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIEZ1bGxHcm93blRyZWUgPSBUaW1lU3Bhbi5Gcm9tSG91cnMoMiksXHJcbiAgICAgICAgICAgICAgICBUaWNrUmF0ZSA9IFRpbWVTcGFuLkZyb21NaWxsaXNlY29uZHMoMTAwKSxcclxuICAgICAgICAgICAgICAgIFNjcmVlblJlZnJlc2hSYXRlID0gVGltZVNwYW4uRnJvbU1pbGxpc2Vjb25kcygxMDAwKSxcclxuICAgICAgICAgICAgICAgIFdhdGVyTWF4ID0gVGltZVNwYW4uRnJvbU1pbnV0ZXMoMTUpLFxyXG4gICAgICAgICAgICAgICAgV2F0ZXJNaW4gPSBUaW1lU3Bhbi5Gcm9tTWludXRlcygzMCksXHJcbiAgICAgICAgICAgICAgICBEdXJhdGlvblVudGlsRGVhZFdoZW5VbmhlYWx0aHkgPSBUaW1lU3Bhbi5Gcm9tTWludXRlcygxNSksXHJcbiAgICAgICAgICAgICAgICBEdXJhdGlvblVudGlsRnVsbEhlYWx0aFdoZW5IZWFsdGh5ID0gVGltZVNwYW4uRnJvbU1pbnV0ZXMoMTUpLFxyXG4gICAgICAgICAgICAgICAgSW5pdGlhbFdhdGVyTGV2ZWwgPSAwLjMsXHJcbiAgICAgICAgICAgICAgICBTZXR0aW5nUHJlZml4ID0gXCJMRDQ2XCJcclxuICAgICAgICAgICAgfS5CdWlsZCgpO31cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcblxyXG5uYW1lc3BhY2UgV2lzY2hpLkxENDYuS2VlcEl0QWxpdmUuQnJpZGdlTmV0XHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBUcmVlU3RhdGVGYWN0b3J5XHJcbiAgICB7XHJcbiAgICAgICAgcHJpdmF0ZSByZWFkb25seSBSYW5kb20gcm5nO1xyXG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgSUNsb2NrIGNsb2NrO1xyXG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgVHJlZUVudmlyb25tZW50Q29uZmlnIHRyZWVFbnZpcm9ubWVudENvbmZpZztcclxuXHJcbiAgICAgICAgcHVibGljIFRyZWVTdGF0ZUZhY3RvcnkoXHJcbiAgICAgICAgICAgIFJhbmRvbSBybmcsXHJcbiAgICAgICAgICAgIElDbG9jayBjbG9jayxcclxuICAgICAgICAgICAgVHJlZUVudmlyb25tZW50Q29uZmlnIHRyZWVFbnZpcm9ubWVudENvbmZpZ1xyXG4gICAgICAgIClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMucm5nID0gcm5nID8/ICgoU3lzdGVtLkZ1bmM8UmFuZG9tPikoKCk9Pnt0aHJvdyBuZXcgQXJndW1lbnROdWxsRXhjZXB0aW9uKFwicm5nXCIpO30pKSgpO1xyXG4gICAgICAgICAgICB0aGlzLmNsb2NrID0gY2xvY2sgPz8gKChTeXN0ZW0uRnVuYzxJQ2xvY2s+KSgoKT0+e3Rocm93IG5ldyBBcmd1bWVudE51bGxFeGNlcHRpb24oXCJjbG9ja1wiKTt9KSkoKTtcclxuICAgICAgICAgICAgdGhpcy50cmVlRW52aXJvbm1lbnRDb25maWcgPSB0cmVlRW52aXJvbm1lbnRDb25maWcgPz8gKChTeXN0ZW0uRnVuYzxUcmVlRW52aXJvbm1lbnRDb25maWc+KSgoKT0+e3Rocm93IG5ldyBBcmd1bWVudE51bGxFeGNlcHRpb24oXCJ0cmVlRW52aXJvbm1lbnRDb25maWdcIik7fSkpKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgVHJlZVN0YXRlIENyZWF0ZVRyZWUoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIG5vdyA9IGNsb2NrLk5vdygpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBUcmVlU3RhdGUoKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBTZWVkID0gcm5nLk5leHQoKSxcclxuICAgICAgICAgICAgICAgIFRpY2tzID0gMCxcclxuICAgICAgICAgICAgICAgIEdyb3d0aCA9IDAsXHJcbiAgICAgICAgICAgICAgICBIZWFsdGggPSAxLFxyXG4gICAgICAgICAgICAgICAgU3RhcnRUaW1lc3RhbXAgPSBub3csXHJcbiAgICAgICAgICAgICAgICBXYXRlckxldmVsID0gdHJlZUVudmlyb25tZW50Q29uZmlnLkluaXRpYWxXYXRlckxldmVsLFxyXG4gICAgICAgICAgICAgICAgTGFzdEV2ZW50VGltZXN0YW1wID0gbm93LFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJuYW1lc3BhY2UgV2lzY2hpLkxENDYuS2VlcEl0QWxpdmVcclxue1xyXG4gICAgcHVibGljIHN0YXRpYyBjbGFzcyBSYW5kb21FeHRlbnNpb25zXHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBkb3VibGUgVW5pZm9ybVJhbmRvbSh0aGlzIElSYW5kb21Tb3VyY2UgcmFuZG9tU291cmNlLCBkb3VibGUgbG93ZXJMaW1pdCwgZG91YmxlIHVwcGVyTGltaXQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgZGVsdGEgPSAodXBwZXJMaW1pdCAtIGxvd2VyTGltaXQpO1xyXG4gICAgICAgICAgICB2YXIgcmFuZEFtb3VudCA9IHJhbmRvbVNvdXJjZS5OZXh0RG91YmxlKCkgKiBkZWx0YTtcclxuICAgICAgICAgICAgcmV0dXJuIGxvd2VyTGltaXQgKyByYW5kQW1vdW50O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcblxyXG5uYW1lc3BhY2UgV2lzY2hpLkxENDYuS2VlcEl0QWxpdmVcclxue1xyXG4gICAgcHVibGljIGNsYXNzIFRyZWVCdWlsZGVyXHJcbiAgICB7XHJcbiAgICAgICAgcHJpdmF0ZSBjb25zdCBkb3VibGUgVEFVID0gNi4yODMxODUzMDcxNzk1ODYyO1xyXG5cclxuICAgICAgICBwcml2YXRlIHJlYWRvbmx5IElSYW5kb21Tb3VyY2UgcmFuZG9tO1xyXG5cclxuICAgICAgICBwdWJsaWMgVHJlZUJ1aWxkZXIoSVJhbmRvbVNvdXJjZSByYW5kb20pXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLnJhbmRvbSA9IHJhbmRvbSA/PyAoKFN5c3RlbS5GdW5jPElSYW5kb21Tb3VyY2U+KSgoKT0+e3Rocm93IG5ldyBBcmd1bWVudE51bGxFeGNlcHRpb24oXCJyYW5kb21cIik7fSkpKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgZG91YmxlIFRydW5rVGhpY2tuZXNzIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgZG91YmxlIFByb2JhYmlsaXR5U2luZ2xlQnJhbmNoIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgZG91YmxlIEJyYW5jaFRoaWNrbmVzc1JlZHVjdGlvbkZhY3RvciB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIGRvdWJsZSBCcmFuY2hMZW5ndGhSZWR1Y3Rpb25GYWN0b3JNaW4geyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBkb3VibGUgQnJhbmNoTGVuZ3RoUmVkdWN0aW9uRmFjdG9yTWF4IHsgZ2V0OyBzZXQ7IH1cclxuXHJcbiAgICAgICAgcHVibGljIGRvdWJsZSBNYXhSb3RhdGlvbkZhY3RvciB7IGdldDsgc2V0OyB9IFxyXG4gICAgICAgIHB1YmxpYyBkb3VibGUgQnJhbmNoU3ByZWFkTWluIHsgZ2V0OyBzZXQ7IH0gXHJcbiAgICAgICAgcHVibGljIGRvdWJsZSBCcmFuY2hTcHJlYWRNYXggeyBnZXQ7IHNldDsgfSBcclxuXHJcblxyXG4gICAgICAgIHB1YmxpYyBpbnQgTWF4RGVwdGggeyBnZXQ7IHNldDsgfVxyXG5cclxuICAgICAgICBwdWJsaWMgVHJlZVNlZ21lbnQgQnVpbGRUcmVlKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciB0cnVuayA9IG5ldyBUcmVlU2VnbWVudChUcnVua1RoaWNrbmVzcyk7XHJcbiAgICAgICAgICAgIEFkZEJyYW5jaGVzVG9TZWdtZW50KHRydW5rLCAwLjI1ICogVEFVKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRydW5rO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSB2b2lkIEFkZEJyYW5jaGVzVG9TZWdtZW50KFRyZWVTZWdtZW50IHNlZ21lbnQsIGRvdWJsZSBhYnNvbHV0ZUFuZ2xlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKHNlZ21lbnQuRGVwdGggPT0gTWF4RGVwdGgpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHNlZ21lbnQuVGhpY2tuZXNzIDwgMC4wMDIpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc3QgZG91YmxlIG1heERldkFuZ2xlID0gMC4xICogVEFVO1xyXG4gICAgICAgICAgICBjb25zdCBkb3VibGUgZ3Jhdml0eU5vcm1hbCA9IDAuNzUgKiBUQVU7XHJcblxyXG4gICAgICAgICAgICB2YXIgZGVsdGFBbmdsZSA9IE1hdGguQXRhbjIoTWF0aC5TaW4oZ3Jhdml0eU5vcm1hbCAtIGFic29sdXRlQW5nbGUpLCBNYXRoLkNvcyhncmF2aXR5Tm9ybWFsIC0gYWJzb2x1dGVBbmdsZSkpO1xyXG5cclxuICAgICAgICAgICAgaWYgKE1hdGguQWJzKGRlbHRhQW5nbGUpIDwgbWF4RGV2QW5nbGUpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyIHJhbmRvbURldmlhdGlvbkFuZ2xlID0gcmFuZG9tLk5leHREb3VibGUoKSAqIDIgKiBNYXhSb3RhdGlvbkZhY3RvciAtIE1heFJvdGF0aW9uRmFjdG9yO1xyXG4gICAgICAgICAgICB2YXIgZGV2aWF0aW9uQW5nbGUgPSBCaWFzZWRWYWx1ZSgwLCByYW5kb21EZXZpYXRpb25BbmdsZSwgMSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgYnJhbmNoaW5nU3ByZWFkID0gcmFuZG9tLlVuaWZvcm1SYW5kb20oQnJhbmNoU3ByZWFkTWluLCBCcmFuY2hTcHJlYWRNYXgpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHNlZ21lbnQuRGVwdGggPT0gMClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgQWRkQW5nbGVkQnJhbmNoKHNlZ21lbnQsIGRldmlhdGlvbkFuZ2xlIC0gYnJhbmNoaW5nU3ByZWFkIC8gMiwgYWJzb2x1dGVBbmdsZSk7XHJcbiAgICAgICAgICAgICAgICBBZGRBbmdsZWRCcmFuY2goc2VnbWVudCwgZGV2aWF0aW9uQW5nbGUgKyBicmFuY2hpbmdTcHJlYWQgLyAyLCBhYnNvbHV0ZUFuZ2xlKTtcclxuICAgICAgICAgICAgICAgIEFkZEFuZ2xlZEJyYW5jaChzZWdtZW50LCBkZXZpYXRpb25BbmdsZSwgYWJzb2x1dGVBbmdsZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAocmFuZG9tLk5leHREb3VibGUoKSA8PSBQcm9iYWJpbGl0eVNpbmdsZUJyYW5jaClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgLy8gbm8gYnJhbmNoaW5nXHJcbiAgICAgICAgICAgICAgICBBZGRBbmdsZWRCcmFuY2goc2VnbWVudCwgZGV2aWF0aW9uQW5nbGUsIGFic29sdXRlQW5nbGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgLy8gYnJhbmNoaW5nXHJcbiAgICAgICAgICAgICAgICB2YXIgbGVmdEFuZ2xlID0gZGV2aWF0aW9uQW5nbGUgLSBicmFuY2hpbmdTcHJlYWQgLyAyO1xyXG4gICAgICAgICAgICAgICAgdmFyIHJpZ2h0QW5nbGUgPSBkZXZpYXRpb25BbmdsZSArIGJyYW5jaGluZ1NwcmVhZCAvIDI7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHJhbmRvbS5OZXh0RG91YmxlKCkgPCAwLjgpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJuZEFuZ2xlID0gcmFuZG9tLlVuaWZvcm1SYW5kb20oZGV2aWF0aW9uQW5nbGUgLSBicmFuY2hpbmdTcHJlYWQsIGRldmlhdGlvbkFuZ2xlICsgYnJhbmNoaW5nU3ByZWFkKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgdGhpY2tuZXNzID0gcmFuZG9tLlVuaWZvcm1SYW5kb20oMC4yNSwgMC41KTtcclxuICAgICAgICAgICAgICAgICAgICBBZGRBbmdsZWRCcmFuY2goc2VnbWVudCwgcm5kQW5nbGUsIGFic29sdXRlQW5nbGUsIGV4dHJhVGhpY2tuZXNzRmFjdG9yOiB0aGlja25lc3MpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIEFkZEFuZ2xlZEJyYW5jaChzZWdtZW50LCBsZWZ0QW5nbGUsIGFic29sdXRlQW5nbGUpO1xyXG4gICAgICAgICAgICAgICAgQWRkQW5nbGVkQnJhbmNoKHNlZ21lbnQsIHJpZ2h0QW5nbGUsIGFic29sdXRlQW5nbGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIGRvdWJsZSBCaWFzZWRWYWx1ZShkb3VibGUgdmFsdWVBLCBkb3VibGUgdmFsdWVCLCBkb3VibGUgYmlhcylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZUIgKiBiaWFzICsgdmFsdWVBICogKDEgLSBiaWFzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgdm9pZCBBZGRBbmdsZWRCcmFuY2goVHJlZVNlZ21lbnQgcGFyZW50LCBkb3VibGUgZGV2aWF0aW9uLCBkb3VibGUgb2xkQWJzb2x1dGVBbmdsZSwgZG91YmxlIGV4dHJhVGhpY2tuZXNzRmFjdG9yID0gMSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBsZW5ndGhGYWN0b3IgPSAwLjg7XHJcblxyXG4gICAgICAgICAgICBpZiAocGFyZW50LkRlcHRoIDwgMylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbGVuZ3RoRmFjdG9yID0gcmFuZG9tLlVuaWZvcm1SYW5kb20oQnJhbmNoTGVuZ3RoUmVkdWN0aW9uRmFjdG9yTWluLCBCcmFuY2hMZW5ndGhSZWR1Y3Rpb25GYWN0b3JNYXgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YXIgbmV4dFRoaW5ja25lc3MgPSBwYXJlbnQuVGhpY2tuZXNzICogQnJhbmNoVGhpY2tuZXNzUmVkdWN0aW9uRmFjdG9yICogZXh0cmFUaGlja25lc3NGYWN0b3I7XHJcblxyXG4gICAgICAgICAgICB2YXIgYnJhbmNoID0gcGFyZW50LkFkZEJyYW5jaChkZXZpYXRpb24sIHBhcmVudC5MZW5ndGggKiBsZW5ndGhGYWN0b3IsIG5leHRUaGluY2tuZXNzKTtcclxuICAgICAgICAgICAgQWRkQnJhbmNoZXNUb1NlZ21lbnQoYnJhbmNoLCBvbGRBYnNvbHV0ZUFuZ2xlICsgZGV2aWF0aW9uKTtcclxuICAgICAgICB9XHJcblxuICAgIFxucHJpdmF0ZSBkb3VibGUgX19Qcm9wZXJ0eV9fSW5pdGlhbGl6ZXJfX1RydW5rVGhpY2tuZXNzPTAuMztwcml2YXRlIGRvdWJsZSBfX1Byb3BlcnR5X19Jbml0aWFsaXplcl9fUHJvYmFiaWxpdHlTaW5nbGVCcmFuY2g9MC4xO3ByaXZhdGUgZG91YmxlIF9fUHJvcGVydHlfX0luaXRpYWxpemVyX19CcmFuY2hUaGlja25lc3NSZWR1Y3Rpb25GYWN0b3I9MC43O3ByaXZhdGUgZG91YmxlIF9fUHJvcGVydHlfX0luaXRpYWxpemVyX19CcmFuY2hMZW5ndGhSZWR1Y3Rpb25GYWN0b3JNaW49MC42O3ByaXZhdGUgZG91YmxlIF9fUHJvcGVydHlfX0luaXRpYWxpemVyX19CcmFuY2hMZW5ndGhSZWR1Y3Rpb25GYWN0b3JNYXg9MC44NTtwcml2YXRlIGRvdWJsZSBfX1Byb3BlcnR5X19Jbml0aWFsaXplcl9fTWF4Um90YXRpb25GYWN0b3I9MC4zMTQxNTkyNjUzNTg5NzkzMTtwcml2YXRlIGRvdWJsZSBfX1Byb3BlcnR5X19Jbml0aWFsaXplcl9fQnJhbmNoU3ByZWFkTWluPTAuNjI4MzE4NTMwNzE3OTU4NjI7cHJpdmF0ZSBkb3VibGUgX19Qcm9wZXJ0eV9fSW5pdGlhbGl6ZXJfX0JyYW5jaFNwcmVhZE1heD0xLjI1NjYzNzA2MTQzNTkxNzM7cHJpdmF0ZSBpbnQgX19Qcm9wZXJ0eV9fSW5pdGlhbGl6ZXJfX01heERlcHRoPTEyO31cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcclxuXHJcbm5hbWVzcGFjZSBXaXNjaGkuTEQ0Ni5LZWVwSXRBbGl2ZVxyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgVHJlZVNlZ21lbnRcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgVHJlZVNlZ21lbnQoZG91YmxlIHRoaWNrbmVzcylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIERlcHRoID0gMDtcclxuICAgICAgICAgICAgRGV2aWF0aW9uQW5nbGUgPSAwO1xyXG4gICAgICAgICAgICBMZW5ndGggPSAxO1xyXG5cclxuICAgICAgICAgICAgQnJhbmNoZXMgPSBuZXcgTGlzdDxUcmVlU2VnbWVudD4oKTtcclxuICAgICAgICAgICAgVGhpY2tuZXNzID0gdGhpY2tuZXNzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBUcmVlU2VnbWVudChpbnQgZGVwdGgsIGRvdWJsZSBkZXZpYXRpb25BbmdsZSwgZG91YmxlIGxlbmd0aCwgZG91YmxlIHRoaWNrbmVzcylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIERlcHRoID0gZGVwdGg7XHJcbiAgICAgICAgICAgIERldmlhdGlvbkFuZ2xlID0gZGV2aWF0aW9uQW5nbGU7XHJcbiAgICAgICAgICAgIExlbmd0aCA9IGxlbmd0aDtcclxuICAgICAgICAgICAgVGhpY2tuZXNzID0gdGhpY2tuZXNzO1xyXG4gICAgICAgICAgICBCcmFuY2hlcyA9IG5ldyBMaXN0PFRyZWVTZWdtZW50PigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIGludCBEZXB0aCB7IGdldDsgcHJpdmF0ZSBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgZG91YmxlIFRoaWNrbmVzcyB7IGdldDsgcHJpdmF0ZSBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgZG91YmxlIERldmlhdGlvbkFuZ2xlIHsgZ2V0OyBwcml2YXRlIHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBkb3VibGUgTGVuZ3RoIHsgZ2V0OyBwcml2YXRlIHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBJTGlzdDxUcmVlU2VnbWVudD4gQnJhbmNoZXMgeyBnZXQ7IHByaXZhdGUgc2V0OyB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBUcmVlU2VnbWVudCBBZGRCcmFuY2goZG91YmxlIGRldmlhdGlvbkFuZ2xlLCBkb3VibGUgbGVuZ3RoLCBkb3VibGUgdGhpY2tuZXNzKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIGJyYW5jaCA9IG5ldyBUcmVlU2VnbWVudChEZXB0aCArIDEsIGRldmlhdGlvbkFuZ2xlLCBsZW5ndGgsIHRoaWNrbmVzcyk7XHJcbiAgICAgICAgICAgIEJyYW5jaGVzLkFkZChicmFuY2gpO1xyXG4gICAgICAgICAgICByZXR1cm4gYnJhbmNoO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJ1c2luZyBTeXN0ZW07XHJcblxyXG5uYW1lc3BhY2UgV2lzY2hpLkxENDYuS2VlcEl0QWxpdmVcclxue1xyXG4gICAgcHVibGljIHN0cnVjdCBWZWN0b3IyRFxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBWZWN0b3IyRChkb3VibGUgeCwgZG91YmxlIHkpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBYID0geDtcclxuICAgICAgICAgICAgWSA9IHk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgZG91YmxlIFggeyBnZXQ7IHByaXZhdGUgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIGRvdWJsZSBZIHsgZ2V0OyBwcml2YXRlIHNldDsgfVxyXG5wdWJsaWMgZG91YmxlIExlbmd0aFxyXG57XHJcbiAgICBnZXRcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gTWF0aC5TcXJ0KFggKiBYICsgWSAqIFkpO1xyXG4gICAgfVxyXG59XHJcbiAgICAgICAgcHVibGljIFZlY3RvcjJEIFJvdGF0ZShkb3VibGUgcmFkaWFuQW5nbGUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgY29zQW5nbGUgPSBNYXRoLkNvcyhyYWRpYW5BbmdsZSk7XHJcbiAgICAgICAgICAgIHZhciBzaW5BbmdsZSA9IE1hdGguU2luKHJhZGlhbkFuZ2xlKTtcclxuXHJcbiAgICAgICAgICAgIHZhciB4ID0gY29zQW5nbGUgKiBYIC0gc2luQW5nbGUgKiBZO1xyXG4gICAgICAgICAgICB2YXIgeSA9IHNpbkFuZ2xlICogWCArIGNvc0FuZ2xlICogWTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgVmVjdG9yMkQoeCwgeSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgVmVjdG9yMkQgQ2hhbmdlTGVuZ3RoKGRvdWJsZSBuZXdMZW5ndGgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgbGVuID0gTGVuZ3RoO1xyXG5cclxuICAgICAgICAgICAgdmFyIG5vcm1hbGl6ZWRYID0gWCAvIGxlbjtcclxuICAgICAgICAgICAgdmFyIG5vcm1hbGl6ZWRZID0gWSAvIGxlbjtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgVmVjdG9yMkQobm9ybWFsaXplZFggKiBuZXdMZW5ndGgsIG5vcm1hbGl6ZWRZICogbmV3TGVuZ3RoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgQnJpZGdlLkh0bWw1O1xyXG5cclxubmFtZXNwYWNlIFdpc2NoaS5MRDQ2LktlZXBJdEFsaXZlLkJyaWRnZU5ldFxyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgQnJpZGdlQ2xvY2sgOiBJQ2xvY2tcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgZG91YmxlIE5vdygpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gRGF0ZS5Ob3coKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgQnJpZGdlLkh0bWw1O1xyXG5cclxubmFtZXNwYWNlIFdpc2NoaS5MRDQ2LktlZXBJdEFsaXZlLkJyaWRnZU5ldFxyXG57XHJcbiAgICAvLy8gPHN1bW1hcnk+XHJcbiAgICAvLy8gVGhpcyBzdG9yYWdlIGlzIGxlZ2FjeSAoc2luY2UgMjIuMDIuMjAyMCkgYW5kIHdpbGwgYmUgcmVtb3ZlZCBsYXRlci5cclxuICAgIC8vLyA8L3N1bW1hcnk+XHJcbiAgICAvLy8gPHJlbWFya3M+XHJcbiAgICAvLy8gVGhpcyBzdG9yZSBpcyBzdGlsbCBtYWludGFpbmVkLCB1bnRpbCBhbGwgdGhlIHRyZWVzIHRoYXQgYXJlIG5vdCB1cGRhdGVkLCBhcmUgZGVhZCBhbnl3YXlzLlxyXG4gICAgLy8vIDwvcmVtYXJrcz5cclxuICAgIHB1YmxpYyBjbGFzcyBMb2NhbFN0b3JhZ2VMZWdhY3lUcmVlU3RhdGVTdG9yZSA6IElUcmVlU3RhdGVTdG9yZVxyXG4gICAge1xyXG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgc3RyaW5nIHNlZWRLZXk7XHJcbiAgICAgICAgcHJpdmF0ZSByZWFkb25seSBzdHJpbmcgdGlja0tleTtcclxuICAgICAgICBwcml2YXRlIHJlYWRvbmx5IHN0cmluZyBzdGFydEtleTtcclxuICAgICAgICBwcml2YXRlIHJlYWRvbmx5IHN0cmluZyBncm93dGhLZXk7XHJcbiAgICAgICAgcHJpdmF0ZSByZWFkb25seSBzdHJpbmcgaGVhbHRoS2V5O1xyXG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgc3RyaW5nIGxhc3RVcGRhdGVLZXk7XHJcbiAgICAgICAgcHJpdmF0ZSByZWFkb25seSBzdHJpbmcgd2F0ZXJMZXZlbEtleTtcclxuXHJcbiAgICAgICAgcHVibGljIExvY2FsU3RvcmFnZUxlZ2FjeVRyZWVTdGF0ZVN0b3JlKHN0cmluZyBwcmVmaXgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzZWVkS2V5ID0gcHJlZml4ICsgXCIuU2VlZFwiO1xyXG4gICAgICAgICAgICB0aWNrS2V5ID0gcHJlZml4ICsgXCIuVGlja3NcIjtcclxuICAgICAgICAgICAgc3RhcnRLZXkgPSBwcmVmaXggKyBcIi5TdGFydFwiO1xyXG4gICAgICAgICAgICBncm93dGhLZXkgPSBwcmVmaXggKyBcIi5Hcm93dGhcIjtcclxuICAgICAgICAgICAgaGVhbHRoS2V5ID0gcHJlZml4ICsgXCIuSGVhbHRoXCI7XHJcbiAgICAgICAgICAgIGxhc3RVcGRhdGVLZXkgPSBwcmVmaXggKyBcIi5MYXN0VXBkYXRlXCI7XHJcbiAgICAgICAgICAgIHdhdGVyTGV2ZWxLZXkgPSBwcmVmaXggKyBcIi5XYXRlckxldmVsXCI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgVHJlZVN0YXRlIEdldCgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgc2VlZFZhbHVlID0gV2luZG93LkxvY2FsU3RvcmFnZS5HZXRJdGVtKHNlZWRLZXkpIGFzIHN0cmluZztcclxuICAgICAgICAgICAgdmFyIHRpY2tWYWx1ZSA9IFdpbmRvdy5Mb2NhbFN0b3JhZ2UuR2V0SXRlbSh0aWNrS2V5KSBhcyBzdHJpbmc7XHJcbiAgICAgICAgICAgIHZhciBzdGFydFZhbHVlID0gV2luZG93LkxvY2FsU3RvcmFnZS5HZXRJdGVtKHN0YXJ0S2V5KSBhcyBzdHJpbmc7XHJcbiAgICAgICAgICAgIHZhciBncm93dGhWYWx1ZSA9IFdpbmRvdy5Mb2NhbFN0b3JhZ2UuR2V0SXRlbShncm93dGhLZXkpIGFzIHN0cmluZztcclxuICAgICAgICAgICAgdmFyIGhlYWx0aFZhbHVlID0gV2luZG93LkxvY2FsU3RvcmFnZS5HZXRJdGVtKGhlYWx0aEtleSkgYXMgc3RyaW5nO1xyXG4gICAgICAgICAgICB2YXIgd2F0ZXJMZXZlbFZhbHVlID0gV2luZG93LkxvY2FsU3RvcmFnZS5HZXRJdGVtKHdhdGVyTGV2ZWxLZXkpIGFzIHN0cmluZztcclxuICAgICAgICAgICAgdmFyIGxhc3RVcGRhdGVWYWx1ZSA9IFdpbmRvdy5Mb2NhbFN0b3JhZ2UuR2V0SXRlbShsYXN0VXBkYXRlS2V5KSBhcyBzdHJpbmc7XHJcbmludCBzZWVkO1xuaW50IHRpY2s7XG5kb3VibGUgc3RhcnQ7XG5kb3VibGUgZ3Jvd3RoO1xuZG91YmxlIGhlYWx0aDtcbmRvdWJsZSBsYXN0VXBkYXRlO1xuZG91YmxlIHdhdGVyTGV2ZWw7XG5cclxuICAgICAgICAgICAgLy8gVXNlIHNpbmdsZSAmIHRvIGZvcmNlIHBhcnNlIGFsbCB2YWx1ZXMgZXZlbiBpZiB0aGUgZmlyc3Qgb25lIGZhaWxlZC5cclxuICAgICAgICAgICAgLy8gV2UgZG8gdGhpcyB0byBwcmV2ZW50IGEgQ1MwMTY1IHVuaW5pdGlhbGl6ZWQgZXJyb3IuXHJcblxyXG4gICAgICAgICAgICB2YXIgcGFyc2VTdWNjZXNzID1cclxuICAgICAgICAgICAgICAgIGludC5UcnlQYXJzZShzZWVkVmFsdWUsIG91dCBzZWVkKSAmXHJcbiAgICAgICAgICAgICAgICBpbnQuVHJ5UGFyc2UodGlja1ZhbHVlLCBvdXQgdGljaykgJlxyXG4gICAgICAgICAgICAgICAgZG91YmxlLlRyeVBhcnNlKHN0YXJ0VmFsdWUsIG91dCBzdGFydCkgJlxyXG4gICAgICAgICAgICAgICAgZG91YmxlLlRyeVBhcnNlKGdyb3d0aFZhbHVlLCBvdXQgZ3Jvd3RoKSAmXHJcbiAgICAgICAgICAgICAgICBkb3VibGUuVHJ5UGFyc2UoaGVhbHRoVmFsdWUsIG91dCBoZWFsdGgpICZcclxuICAgICAgICAgICAgICAgIGRvdWJsZS5UcnlQYXJzZShsYXN0VXBkYXRlVmFsdWUsIG91dCBsYXN0VXBkYXRlKSAmXHJcbiAgICAgICAgICAgICAgICBkb3VibGUuVHJ5UGFyc2Uod2F0ZXJMZXZlbFZhbHVlLCBvdXQgd2F0ZXJMZXZlbCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoIXBhcnNlU3VjY2VzcylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgVHJlZVN0YXRlKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgU2VlZCA9IHNlZWQsXHJcbiAgICAgICAgICAgICAgICBUaWNrcyA9IHRpY2ssXHJcbiAgICAgICAgICAgICAgICBHcm93dGggPSBncm93dGgsXHJcbiAgICAgICAgICAgICAgICBIZWFsdGggPSBoZWFsdGgsXHJcbiAgICAgICAgICAgICAgICBTdGFydFRpbWVzdGFtcCA9IHN0YXJ0LFxyXG4gICAgICAgICAgICAgICAgV2F0ZXJMZXZlbCA9IHdhdGVyTGV2ZWwsXHJcbiAgICAgICAgICAgICAgICBMYXN0RXZlbnRUaW1lc3RhbXAgPSBsYXN0VXBkYXRlLFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgU2V0KFRyZWVTdGF0ZSB0cmVlU3RhdGUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBXaW5kb3cuTG9jYWxTdG9yYWdlLlNldEl0ZW0oc2VlZEtleSwgdHJlZVN0YXRlLlNlZWQpO1xyXG4gICAgICAgICAgICBXaW5kb3cuTG9jYWxTdG9yYWdlLlNldEl0ZW0odGlja0tleSwgdHJlZVN0YXRlLlRpY2tzKTtcclxuICAgICAgICAgICAgV2luZG93LkxvY2FsU3RvcmFnZS5TZXRJdGVtKGhlYWx0aEtleSwgdHJlZVN0YXRlLkhlYWx0aCk7XHJcbiAgICAgICAgICAgIFdpbmRvdy5Mb2NhbFN0b3JhZ2UuU2V0SXRlbShncm93dGhLZXksIHRyZWVTdGF0ZS5Hcm93dGgpO1xyXG4gICAgICAgICAgICBXaW5kb3cuTG9jYWxTdG9yYWdlLlNldEl0ZW0oc3RhcnRLZXksIHRyZWVTdGF0ZS5TdGFydFRpbWVzdGFtcCk7XHJcbiAgICAgICAgICAgIFdpbmRvdy5Mb2NhbFN0b3JhZ2UuU2V0SXRlbSh3YXRlckxldmVsS2V5LCB0cmVlU3RhdGUuV2F0ZXJMZXZlbCk7XHJcbiAgICAgICAgICAgIFdpbmRvdy5Mb2NhbFN0b3JhZ2UuU2V0SXRlbShsYXN0VXBkYXRlS2V5LCB0cmVlU3RhdGUuTGFzdEV2ZW50VGltZXN0YW1wKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIFJlbW92ZUxlZ2FjeSgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBXaW5kb3cuTG9jYWxTdG9yYWdlLlJlbW92ZUl0ZW0oc2VlZEtleSk7XHJcbiAgICAgICAgICAgIFdpbmRvdy5Mb2NhbFN0b3JhZ2UuUmVtb3ZlSXRlbSh0aWNrS2V5KTtcclxuICAgICAgICAgICAgV2luZG93LkxvY2FsU3RvcmFnZS5SZW1vdmVJdGVtKGhlYWx0aEtleSk7XHJcbiAgICAgICAgICAgIFdpbmRvdy5Mb2NhbFN0b3JhZ2UuUmVtb3ZlSXRlbShncm93dGhLZXkpO1xyXG4gICAgICAgICAgICBXaW5kb3cuTG9jYWxTdG9yYWdlLlJlbW92ZUl0ZW0oc3RhcnRLZXkpO1xyXG4gICAgICAgICAgICBXaW5kb3cuTG9jYWxTdG9yYWdlLlJlbW92ZUl0ZW0od2F0ZXJMZXZlbEtleSk7XHJcbiAgICAgICAgICAgIFdpbmRvdy5Mb2NhbFN0b3JhZ2UuUmVtb3ZlSXRlbShsYXN0VXBkYXRlS2V5KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcclxudXNpbmcgU3lzdGVtLlRleHQ7XHJcblxyXG5uYW1lc3BhY2UgV2lzY2hpLkxENDYuS2VlcEl0QWxpdmVcclxue1xyXG4gICAgcHVibGljIGNsYXNzIFJhbmRvbVdyYXBwZXIgOiBJUmFuZG9tU291cmNlXHJcbiAgICB7XHJcbiAgICAgICAgcHJpdmF0ZSBSYW5kb20gcmFuZG9tO1xyXG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgaW50IHNlZWQ7XHJcblxyXG4gICAgICAgIHB1YmxpYyBSYW5kb21XcmFwcGVyKGludCBzZWVkKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5zZWVkID0gc2VlZDtcclxuICAgICAgICAgICAgUmVzZXQoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIFJlc2V0KClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJhbmRvbSA9IG5ldyBSYW5kb20oc2VlZCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgZG91YmxlIE5leHREb3VibGUoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJhbmRvbS5OZXh0RG91YmxlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiJdCn0K
