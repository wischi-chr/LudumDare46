/**
 * @version 1.0.0.0
 * @copyright Copyright ©  2020
 * @compiler Bridge.NET 17.10.1
 */
Bridge.assembly("Wischi.LD46.KeepItAlive.BridgeNet", function ($asm, globals) {
    "use strict";

    Bridge.define("Wischi.LD46.KeepItAlive.BridgeNet.App", {
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
            canvas: null,
            ctx: null,
            rnd: null,
            pixelScreen: null,
            trunk: null,
            treeDrawingContext: null,
            water: null,
            reset: null,
            treeRndSource: null,
            grassRandom: null,
            GrowthControl: 0,
            WaterAmount: 0,
            ThicknessControl: 0,
            WaterDelta: 0,
            IsDead: false,
            waterInfoWasShown: false,
            waterInfoDeactivated: false
        },
        props: {
            SkyColor: {
                get: function () {
                    return this.IsDead ? "#444" : "#B2FFFF";
                }
            },
            GrassBackgroundColor: {
                get: function () {
                    return this.IsDead ? "#333" : "#7EC850";
                }
            },
            GrassColor: {
                get: function () {
                    return this.IsDead ? "#111" : "#206411";
                }
            }
        },
        ctors: {
            init: function () {
                this.rnd = new System.Random.ctor();
                this.waterInfoWasShown = false;
                this.waterInfoDeactivated = false;
            },
            ctor: function (canvas, water, reset, seed) {
                var $t;
                this.$initialize();
                this.canvas = canvas;
                this.water = water;
                this.reset = reset;
                canvas.width = Wischi.LD46.KeepItAlive.BridgeNet.App.CanvasWidth;
                canvas.height = Wischi.LD46.KeepItAlive.BridgeNet.App.CanvasHeight;

                this.pixelScreen = new Wischi.LD46.KeepItAlive.BridgeNet.PixelScreen();

                this.ctx = canvas.getContext("2d");

                this.pixelScreen.SetPixel(0, 0, true);





                this.UpdateSeed(seed);

                this.treeDrawingContext = ($t = new Wischi.LD46.KeepItAlive.BridgeNet.TreeDrawingContext(this.ctx), $t.ScaleFactor = Wischi.LD46.KeepItAlive.BridgeNet.App.ScaleFactor, $t.StartX = 256, $t.StartY = Wischi.LD46.KeepItAlive.BridgeNet.App.TreeYOffset, $t.LeafLimit = 0.02, $t);
            }
        },
        methods: {
            UpdateSeed: function (newSeed) {
                var treeRndSource = new Wischi.LD46.KeepItAlive.RandomWrapper(newSeed);
                var treeBuilder = new Wischi.LD46.KeepItAlive.TreeBuilder(treeRndSource);
                this.trunk = treeBuilder.BuildTree();

                this.grassRandom = new Wischi.LD46.KeepItAlive.RandomWrapper(newSeed);
            },
            Redraw: function () {
                this.grassRandom.Reset();

                this.ctx.fillStyle = this.SkyColor;
                this.ctx.clearRect(0, 0, 512, 512);
                this.ctx.fillRect(0, 0, 512, 512);

                this.treeDrawingContext.GrowthFactor = Wischi.LD46.KeepItAlive.BridgeNet.EasingHelper.EaseOutQuad(this.GrowthControl * 0.75 + 0.25);
                this.treeDrawingContext.LeafFactor = this.ThicknessControl * 0.9;
                this.treeDrawingContext.IsDead = this.IsDead;

                var grassHeight = 370;
                this.ctx.fillStyle = this.GrassBackgroundColor;
                this.ctx.fillRect(0, grassHeight, Wischi.LD46.KeepItAlive.BridgeNet.App.CanvasWidth, ((Wischi.LD46.KeepItAlive.BridgeNet.App.CanvasHeight - grassHeight) | 0));

                var grassForegroundLimit = 400;

                for (var y = (grassHeight - 10) | 0; y < grassForegroundLimit; y = (y + 5) | 0) {
                    this.DrawGrass(y, 512);
                }

                this.treeDrawingContext.DrawTree(this.trunk);

                for (var y1 = grassForegroundLimit; y1 < Wischi.LD46.KeepItAlive.BridgeNet.App.CanvasHeight; y1 = (y1 + 5) | 0) {
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

                if (this.WaterAmount + this.WaterDelta > 1) {
                    waterPredition = 1;
                }

                if (!this.IsDead) {
                    this.ctx.fillStyle = "#B2FFFF60";
                    this.ctx.fillRect(((0 + marginLeft) | 0), ((((((Wischi.LD46.KeepItAlive.BridgeNet.App.CanvasHeight - marginBottom) | 0) - Bridge.Int.mul(2, padding)) | 0) - height) | 0), ((((Wischi.LD46.KeepItAlive.BridgeNet.App.CanvasWidth - margin) | 0) - marginLeft) | 0), ((height + Bridge.Int.mul(2, padding)) | 0));

                    this.ctx.fillStyle = "#0077BE80";
                    this.ctx.fillRect(((((0 + marginLeft) | 0) + padding) | 0), ((((((Wischi.LD46.KeepItAlive.BridgeNet.App.CanvasHeight - marginBottom) | 0) - padding) | 0) - height) | 0), Bridge.Int.mul((((((((Wischi.LD46.KeepItAlive.BridgeNet.App.CanvasWidth - Bridge.Int.mul(2, padding)) | 0) - margin) | 0) - marginLeft) | 0)), waterPredition), height);

                    this.ctx.fillStyle = "#0077BE";
                    this.ctx.fillRect(((((0 + marginLeft) | 0) + padding) | 0), ((((((Wischi.LD46.KeepItAlive.BridgeNet.App.CanvasHeight - marginBottom) | 0) - padding) | 0) - height) | 0), (((((((Wischi.LD46.KeepItAlive.BridgeNet.App.CanvasWidth - Bridge.Int.mul(2, padding)) | 0) - margin) | 0) - marginLeft) | 0)) * this.WaterAmount, height);
                }

                var icon = this.water;
                var iconLeft = 5;

                if (this.IsDead) {
                    iconLeft = 20;
                    icon = this.reset;
                }

                this.ctx.imageSmoothingEnabled = true;
                this.ctx.drawImage(icon, iconLeft, 433, 64.0, 64.0);

                this.ctx.fillStyle = "#000";
                this.ctx.font = "bold 16px Arial, sans-serif";

                var text = "";

                if (!this.IsDead) {
                    var lastWaterinfo = this.waterInfoWasShown;
                    this.waterInfoWasShown = false;

                    if ((this.WaterAmount < 0.5 && !this.waterInfoDeactivated) || this.WaterAmount < 0.001) {
                        text = "\u2bc7 click to water your tree";
                        this.waterInfoWasShown = true;
                    } else if (this.WaterAmount > 0.999) {
                        text = "swamped";
                    }

                    if (lastWaterinfo && !this.waterInfoWasShown) {
                        this.waterInfoDeactivated = true;
                    }
                } else {
                    this.ctx.font = "bold 24px Arial, sans-serif";
                    marginLeft = (marginLeft + 30) | 0;
                }

                this.ctx.fillText(text, ((((marginLeft + padding) | 0) + 15) | 0), ((((((Wischi.LD46.KeepItAlive.BridgeNet.App.CanvasHeight - marginBottom) | 0) - padding) | 0) - 10) | 0));
            },
            DrawGrass: function (y, amount) {
                var grassScale = 16.0;

                this.ctx.strokeStyle = this.GrassColor;
                this.ctx.lineWidth = grassScale * 0.025;

                this.ctx.beginPath();

                for (var i = 0; i < amount; i = (i + 1) | 0) {

                    var x = this.grassRandom.NextDouble() * Wischi.LD46.KeepItAlive.BridgeNet.App.CanvasWidth;

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

    Bridge.define("Wischi.LD46.KeepItAlive.BridgeNet.PixelScreen", {
        fields: {
            ImageData: null
        },
        props: {
            Width: {
                get: function () {
                    return 64;
                }
            },
            Height: {
                get: function () {
                    return 64;
                }
            }
        },
        ctors: {
            ctor: function () {
                this.$initialize();
                this.ImageData = new ImageData(((this.Width) >>> 0), ((this.Height) >>> 0));

                for (var i = 0; i < this.ImageData.data.length; i = (i + 4) | 0) {
                    this.ImageData.data[((i + 0) | 0)] = 255;
                    this.ImageData.data[((i + 1) | 0)] = 255;
                    this.ImageData.data[((i + 2) | 0)] = 255;
                    this.ImageData.data[((i + 3) | 0)] = 255;
                }
            }
        },
        methods: {
            SetPixel: function (x, y, set) {
                if (x < 0 || x >= this.Width || y < 0 || y >= this.Height) {
                    return;
                }

                var value = set ? 0 : 255;
                var arrayPosition = Bridge.Int.mul((((Bridge.Int.mul(y, this.Width) + x) | 0)), 4);

                this.ImageData.data[((arrayPosition + 0) | 0)] = value;
                this.ImageData.data[((arrayPosition + 1) | 0)] = value;
                this.ImageData.data[((arrayPosition + 2) | 0)] = value;
            }
        }
    });

    Bridge.define("Wischi.LD46.KeepItAlive.IPixelScreenWriter", {
        $kind: "interface"
    });

    Bridge.define("Wischi.LD46.KeepItAlive.BridgeNet.Program", {
        statics: {
            fields: {
                canvas: null
            },
            ctors: {
                init: function () {
                    Bridge.ready(this.Main);
                }
            },
            methods: {
                Main: function () {
                    var $t;
                    var Update = null;
                    Wischi.LD46.KeepItAlive.BridgeNet.Program.canvas = Bridge.as(document.getElementById("canvas"), HTMLCanvasElement);

                    if (Wischi.LD46.KeepItAlive.BridgeNet.Program.canvas == null) {
                        return;
                    }

                    var water = ($t = new Image(), $t.src = "img/water.png", $t);
                    var reset = ($t = new Image(), $t.src = "img/reset.png", $t);

                    var config = Wischi.LD46.KeepItAlive.BridgeNet.TreeConfigurations.ReleaseConfig;
                    var startMs = Date.now();

                    var treeBehaviour = Wischi.LD46.KeepItAlive.BridgeNet.Program.LoadFromLocalStorage(config);
                    var app = new Wischi.LD46.KeepItAlive.BridgeNet.App(Wischi.LD46.KeepItAlive.BridgeNet.Program.canvas, water, reset, treeBehaviour.Seed);
                    Update = function () {
                        treeBehaviour.Update(Date.now());
                        app.GrowthControl = treeBehaviour.Growth;
                        app.WaterAmount = Math.min(1, treeBehaviour.WaterLevel);
                        app.ThicknessControl = treeBehaviour.Health;
                        app.WaterDelta = treeBehaviour.WaterDelta;
                        app.IsDead = treeBehaviour.Health === 0;
                        Wischi.LD46.KeepItAlive.BridgeNet.Program.SaveToLocalStorage(treeBehaviour, config, false);
                    };

                    water.addEventListener("load", function () {
                        Update();
                        app.Redraw();
                    });



                    Wischi.LD46.KeepItAlive.BridgeNet.Program.canvas.addEventListener("click", function (e) {
                        var me;
                        if (!(((me = Bridge.as(e, MouseEvent))) != null)) {
                            return;
                        }

                        var rect = e.target.getBoundingClientRect();
                        var x = Math.floor(e.clientX - rect.left);
                        var y = Math.floor(e.clientY - rect.top);
                        var xx = x;
                        var yy = y;

                        if (xx <= 80 && yy >= 430) {
                            if (treeBehaviour.Health === 0) {
                                window.localStorage.removeItem((config.SettingPrefix || "") + ".Seed");
                                treeBehaviour = Wischi.LD46.KeepItAlive.BridgeNet.Program.LoadFromLocalStorage(config);
                                app.UpdateSeed(treeBehaviour.Seed);
                            } else {
                                treeBehaviour.Water();
                            }

                            Update();
                            app.Redraw();
                        }
                    });

                    var redrawTimer = window.setInterval(function () {
                        app.Redraw();
                    }, config.MsRefreshRate);

                    var tickTimer = window.setInterval(Update, config.MsTickRate);

                    Update();
                },
                SaveToLocalStorage: function (treeBehaviour, config, saveSeed) {
                    var seedKey = (config.SettingPrefix || "") + ".Seed";
                    var healthKey = (config.SettingPrefix || "") + ".Health";
                    var waterLevelKey = (config.SettingPrefix || "") + ".WaterLevel";
                    var growthKey = (config.SettingPrefix || "") + ".Growth";
                    var tickKey = (config.SettingPrefix || "") + ".Ticks";
                    var startKey = (config.SettingPrefix || "") + ".Start";
                    var lastUpdateKey = (config.SettingPrefix || "") + ".LastUpdate";

                    if (saveSeed) {
                        window.localStorage.setItem(seedKey, treeBehaviour.Seed);
                    }

                    window.localStorage.setItem(healthKey, treeBehaviour.Health);
                    window.localStorage.setItem(waterLevelKey, treeBehaviour.WaterLevel);
                    window.localStorage.setItem(growthKey, treeBehaviour.Growth);
                    window.localStorage.setItem(tickKey, treeBehaviour.Ticks);
                    window.localStorage.setItem(startKey, treeBehaviour.Start);
                    window.localStorage.setItem(lastUpdateKey, treeBehaviour.LastUpdate);
                },
                LoadFromLocalStorage: function (config) {
                    var seedKey = (config.SettingPrefix || "") + ".Seed";
                    var healthKey = (config.SettingPrefix || "") + ".Health";
                    var waterLevelKey = (config.SettingPrefix || "") + ".WaterLevel";
                    var growthKey = (config.SettingPrefix || "") + ".Growth";
                    var tickKey = (config.SettingPrefix || "") + ".Ticks";
                    var startKey = (config.SettingPrefix || "") + ".Start";
                    var lastUpdateKey = (config.SettingPrefix || "") + ".LastUpdate";

                    var healthValue = Bridge.as(window.localStorage.getItem(healthKey), System.String);
                    var seedValue = Bridge.as(window.localStorage.getItem(seedKey), System.String);
                    var waterLevelValue = Bridge.as(window.localStorage.getItem(waterLevelKey), System.String);
                    var growthValue = Bridge.as(window.localStorage.getItem(growthKey), System.String);
                    var tickValue = Bridge.as(window.localStorage.getItem(tickKey), System.String);
                    var startValue = Bridge.as(window.localStorage.getItem(startKey), System.String);
                    var lastUpdateValue = Bridge.as(window.localStorage.getItem(lastUpdateKey), System.String);

                    var resetTree = false;
                    var seed = { };

                    if (!System.Int32.tryParse(seedValue, seed)) {
                        seed.v = new System.Random.ctor().Next();
                        resetTree = true;
                    }
                    var health = { };

                    if (!System.Double.tryParse(healthValue, null, health) || resetTree) {
                        health.v = 1;
                    }
                    var waterLevel = { };

                    if (!System.Double.tryParse(waterLevelValue, null, waterLevel) || resetTree) {
                        waterLevel.v = config.InitialWaterLevel;
                    }
                    var growth = { };

                    if (!System.Double.tryParse(growthValue, null, growth) || resetTree) {
                        growth.v = 0;
                    }
                    var tick = { };

                    if (!System.Int32.tryParse(tickValue, tick) || resetTree) {
                        tick.v = 0;
                    }
                    var start = { };

                    if (!System.Double.tryParse(startValue, null, start) || resetTree) {
                        start.v = Date.now();
                    }
                    var lastUpdate = { };

                    if (!System.Double.tryParse(lastUpdateValue, null, lastUpdate) || resetTree) {
                        lastUpdate.v = Date.now();
                    }

                    var behaviour = new Wischi.LD46.KeepItAlive.BridgeNet.TreeBehaviourEngine(config, start.v, lastUpdate.v, health.v, waterLevel.v, growth.v, tick.v, seed.v);
                    Wischi.LD46.KeepItAlive.BridgeNet.Program.SaveToLocalStorage(behaviour, config, true);
                    return behaviour;
                }
            }
        },
        $entryPoint: true
    });

    Bridge.define("Wischi.LD46.KeepItAlive.BridgeNet.TreeBehaviourEngine", {
        fields: {
            rndSource: null,
            config: null,
            WaterDelta: 0,
            WaterLevel: 0,
            Start: 0,
            LastUpdate: 0,
            Health: 0,
            Growth: 0,
            Ticks: 0,
            Seed: 0
        },
        props: {
            IsHealthy: {
                get: function () {
                    return this.WaterLevel > 0.001 && this.WaterLevel <= 1;
                }
            }
        },
        ctors: {
            ctor: function (config, start, lastUpdate, health, waterLevel, growth, ticks, seed) {
                this.$initialize();
                this.config = config;
                this.Start = start;
                this.LastUpdate = lastUpdate;
                this.Health = health;
                this.Growth = growth;
                this.Ticks = ticks;
                this.Seed = seed;
                this.WaterLevel = waterLevel;
                this.WaterDelta = 0.125;

                this.rndSource = new Wischi.LD46.KeepItAlive.RandomWrapper(seed);
            }
        },
        methods: {
            Water: function () {
                this.WaterLevel += this.WaterDelta;
            },
            Update: function (now) {
                var targetTicks = Bridge.Int.clip32((now - this.Start) / this.config.MsTickRate);
                var delta = (targetTicks - this.Ticks) | 0;

                for (var i = 0; i < delta; i = (i + 1) | 0) {
                    this.Tick();
                }

                this.LastUpdate = now;
            },
            Tick: function () {
                this.Ticks = (this.Ticks + 1) | 0;

                this.GrowthTick();
                this.WaterTick();
                this.HealthTick();
            },
            GrowthTick: function () {
                if (this.Growth >= 1) {
                    this.Growth = 1;
                } else {
                    this.Growth += this.config.MaxGrowthRate * this.Health;
                }
            },
            WaterTick: function () {
                var wDelta = this.config.MaxWaterRate - this.config.MinWaterRate;
                var waterAmount = this.rndSource.NextDouble() * wDelta + this.config.MinWaterRate;
                this.WaterLevel -= waterAmount;

                if (this.WaterLevel < 0) {
                    this.WaterLevel = 0;
                }
            },
            HealthTick: function () {
                if (this.Health <= 0) {
                    this.Health = 0;
                    return;
                }

                if (this.IsHealthy) {
                    this.Health += this.config.HealRate;
                } else {
                    this.Health -= this.config.HarmRate;
                }

                if (this.Health < 0) {
                    this.Health = 0;
                } else if (this.Health > 1) {
                    this.Health = 1;
                }
            }
        }
    });

    Bridge.define("Wischi.LD46.KeepItAlive.BridgeNet.TreeConfiguration", {
        fields: {
            MaxGrowthRate: 0,
            MinWaterRate: 0,
            MaxWaterRate: 0,
            HealRate: 0,
            HarmRate: 0,
            InitialWaterLevel: 0,
            MsRefreshRate: 0,
            MsTickRate: 0,
            SettingPrefix: null
        },
        ctors: {
            ctor: function (maxGrowthRate, minWaterRate, maxWaterRate, healRate, harmRate, initialWaterLevel, msRefreshRate, msTickRate, settingPrefix) {
                this.$initialize();
                this.MaxGrowthRate = maxGrowthRate;
                this.MinWaterRate = minWaterRate;
                this.MaxWaterRate = maxWaterRate;
                this.HealRate = healRate;
                this.HarmRate = harmRate;
                this.InitialWaterLevel = initialWaterLevel;
                this.MsRefreshRate = msRefreshRate;
                this.MsTickRate = msTickRate;
                this.SettingPrefix = settingPrefix;
            }
        }
    });

    Bridge.define("Wischi.LD46.KeepItAlive.BridgeNet.TreeConfigurationBuilder", {
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
                return new Wischi.LD46.KeepItAlive.BridgeNet.TreeConfiguration(this.GetPerTickValue(this.FullGrownTree), this.GetPerTickValue(this.WaterMin), this.GetPerTickValue(this.WaterMax), this.GetPerTickValue(this.DurationUntilFullHealthWhenHealthy), this.GetPerTickValue(this.DurationUntilDeadWhenUnhealthy), this.InitialWaterLevel, Bridge.Int.clip32(Bridge.Math.round(this.ScreenRefreshRate.getTotalMilliseconds(), 0, 6)), Bridge.Int.clip32(Bridge.Math.round(this.TickRate.getTotalMilliseconds(), 0, 6)), this.SettingPrefix);
            },
            GetPerTickValue: function (value) {
                return 1.0 / (value.getTotalMilliseconds() / this.TickRate.getTotalMilliseconds());
            }
        }
    });

    Bridge.define("Wischi.LD46.KeepItAlive.BridgeNet.TreeConfigurations", {
        statics: {
            fields: {
                ReleaseConfig: null,
                DebugConfig: null,
                LudumDare46Test: null
            },
            ctors: {
                init: function () {
                    var $t;
                    this.ReleaseConfig = ($t = new Wischi.LD46.KeepItAlive.BridgeNet.TreeConfigurationBuilder(), $t.FullGrownTree = System.TimeSpan.fromDays(730), $t.TickRate = System.TimeSpan.fromMinutes(15), $t.WaterMax = System.TimeSpan.fromDays(16), $t.WaterMin = System.TimeSpan.fromDays(5), $t.ScreenRefreshRate = System.TimeSpan.fromMinutes(1), $t.DurationUntilDeadWhenUnhealthy = System.TimeSpan.fromDays(14), $t.DurationUntilFullHealthWhenHealthy = System.TimeSpan.fromDays(14), $t.InitialWaterLevel = 0.3, $t.SettingPrefix = "bonsai", $t).Build();
                    this.DebugConfig = ($t = new Wischi.LD46.KeepItAlive.BridgeNet.TreeConfigurationBuilder(), $t.FullGrownTree = System.TimeSpan.fromMinutes(1), $t.TickRate = System.TimeSpan.fromMilliseconds(10), $t.WaterMax = System.TimeSpan.fromSeconds(16), $t.WaterMin = System.TimeSpan.fromSeconds(5), $t.ScreenRefreshRate = System.TimeSpan.fromMilliseconds(100), $t.DurationUntilDeadWhenUnhealthy = System.TimeSpan.fromSeconds(10), $t.DurationUntilFullHealthWhenHealthy = System.TimeSpan.fromSeconds(10), $t.InitialWaterLevel = 1, $t.SettingPrefix = "debug", $t).Build();
                    this.LudumDare46Test = ($t = new Wischi.LD46.KeepItAlive.BridgeNet.TreeConfigurationBuilder(), $t.FullGrownTree = System.TimeSpan.fromHours(2), $t.TickRate = System.TimeSpan.fromMilliseconds(100), $t.ScreenRefreshRate = System.TimeSpan.fromMilliseconds(1000), $t.WaterMax = System.TimeSpan.fromMinutes(15), $t.WaterMin = System.TimeSpan.fromMinutes(30), $t.DurationUntilDeadWhenUnhealthy = System.TimeSpan.fromMinutes(15), $t.DurationUntilFullHealthWhenHealthy = System.TimeSpan.fromMinutes(15), $t.InitialWaterLevel = 0.3, $t.SettingPrefix = "LD46", $t).Build();
                }
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

                var floatDepth = segment.Depth / this.MaxDepth;
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
                var floatDepth = parent.Depth / this.MaxDepth;

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

    Bridge.define("Wischi.LD46.KeepItAlive.Vector2d", {
        $kind: "struct",
        statics: {
            methods: {
                getDefaultValue: function () { return new Wischi.LD46.KeepItAlive.Vector2d(); }
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

                return new Wischi.LD46.KeepItAlive.Vector2d.$ctor1(x, y);
            },
            ChangeLength: function (newLength) {
                var len = this.Length;

                var normalizedX = this.X / len;
                var normalizedY = this.Y / len;

                return new Wischi.LD46.KeepItAlive.Vector2d.$ctor1(normalizedX * newLength, normalizedY * newLength);
            },
            getHashCode: function () {
                var h = Bridge.addHash([3633698757, this.X, this.Y]);
                return h;
            },
            equals: function (o) {
                if (!Bridge.is(o, Wischi.LD46.KeepItAlive.Vector2d)) {
                    return false;
                }
                return Bridge.equals(this.X, o.X) && Bridge.equals(this.Y, o.Y);
            },
            $clone: function (to) { return this; }
        }
    });

    Bridge.define("Wischi.LD46.KeepItAlive.BridgeNet.PixelScreenSegmentWriter", {
        inherits: [Wischi.LD46.KeepItAlive.IPixelScreenWriter],
        alias: ["SetPixel", "Wischi$LD46$KeepItAlive$IPixelScreenWriter$SetPixel"],
        ctors: {
            ctor: function (pixelScreenWriter) {
                this.$initialize();

            }
        },
        methods: {
            SetPixel: function (x, y, set) {
                throw new System.NotImplementedException.ctor();
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICJXaXNjaGkuTEQ0Ni5LZWVwSXRBbGl2ZS5CcmlkZ2VOZXQuanMiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbIkFwcC5jcyIsIlByb2dyYW0uY3MiLCIuLi9XaXNjaGkuTEQ0Ni5LZWVwSXRBbGl2ZS5TaGFyZWQvQ2xhc3MxLmNzIl0sCiAgIm5hbWVzIjogWyIiXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztvQkFrQ1FBLE9BQU9BOzs7OztvQkFNUEEsT0FBT0E7Ozs7O29CQU1QQSxPQUFPQTs7Ozs7OzJCQXBDdUJBLElBQUlBOzs7OzRCQXVDdkJBLFFBQTBCQSxPQUF3QkEsT0FBd0JBOzs7Z0JBRWpGQSxjQUFjQTtnQkFDZEEsYUFBYUE7Z0JBQ2JBLGFBQWFBO2dCQUNiQSxlQUFlQTtnQkFDZkEsZ0JBQWdCQTs7Z0JBRWhCQSxtQkFBY0EsSUFBSUE7O2dCQUVsQkEsV0FBTUEsa0JBQWtCQTs7Z0JBRXhCQTs7Ozs7O2dCQWNBQSxnQkFBV0E7O2dCQUVYQSwwQkFBcUJBLFVBQUlBLHFEQUFtQkEsNEJBRTFCQSwrREFDTEEsaUJBQ0FBOzs7O2tDQUtNQTtnQkFFbkJBLG9CQUFvQkEsSUFBSUEsc0NBQWNBO2dCQUN0Q0Esa0JBQWtCQSxJQUFJQSxvQ0FBWUE7Z0JBQ2xDQSxhQUFRQTs7Z0JBRVJBLG1CQUFjQSxJQUFJQSxzQ0FBY0E7OztnQkFRaENBOztnQkFFQUEscUJBQWdCQTtnQkFDaEJBO2dCQUNBQTs7Z0JBRUFBLHVDQUFrQ0EsMkRBQXlCQTtnQkFDM0RBLHFDQUFnQ0E7Z0JBQ2hDQSxpQ0FBNEJBOztnQkFFNUJBLGtCQUFrQkE7Z0JBQ2xCQSxxQkFBZ0JBO2dCQUNoQkEscUJBQWdCQSxhQUFhQSxtREFBYUEsdURBQWVBOztnQkFFekRBLDJCQUEyQkE7O2dCQUUzQkEsS0FBS0EsUUFBUUEsd0JBQWtCQSxJQUFJQSxzQkFBc0JBO29CQUVyREEsZUFBVUE7Oztn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OztnQkFLcEJBLE9BQU9BIiwKICAic291cmNlc0NvbnRlbnQiOiBbInVzaW5nIEJyaWRnZS5IdG1sNTtcclxudXNpbmcgU3lzdGVtO1xyXG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcclxuXHJcbm5hbWVzcGFjZSBXaXNjaGkuTEQ0Ni5LZWVwSXRBbGl2ZS5CcmlkZ2VOZXRcclxue1xyXG4gICAgcHVibGljIGNsYXNzIEFwcFxyXG4gICAge1xyXG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgSFRNTENhbnZhc0VsZW1lbnQgY2FudmFzO1xyXG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEIGN0eDtcclxuICAgICAgICBwcml2YXRlIHJlYWRvbmx5IFJhbmRvbSBybmQgPSBuZXcgUmFuZG9tKCk7XHJcbiAgICAgICAgcHJpdmF0ZSByZWFkb25seSBQaXhlbFNjcmVlbiBwaXhlbFNjcmVlbjtcclxuICAgICAgICBwcml2YXRlIFRyZWVTZWdtZW50IHRydW5rO1xyXG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgVHJlZURyYXdpbmdDb250ZXh0IHRyZWVEcmF3aW5nQ29udGV4dDtcclxuICAgICAgICBwcml2YXRlIHJlYWRvbmx5IEhUTUxJbWFnZUVsZW1lbnQgd2F0ZXI7XHJcbiAgICAgICAgcHJpdmF0ZSByZWFkb25seSBIVE1MSW1hZ2VFbGVtZW50IHJlc2V0O1xyXG5cclxuICAgICAgICBwcml2YXRlIHJlYWRvbmx5IFJhbmRvbVdyYXBwZXIgdHJlZVJuZFNvdXJjZTtcclxuICAgICAgICBwcml2YXRlIFJhbmRvbVdyYXBwZXIgZ3Jhc3NSYW5kb207XHJcblxyXG4gICAgICAgIHByaXZhdGUgY29uc3QgaW50IENhbnZhc1dpZHRoID0gNTEyO1xyXG4gICAgICAgIHByaXZhdGUgY29uc3QgaW50IENhbnZhc0hlaWdodCA9IDUxMjtcclxuICAgICAgICBwcml2YXRlIGNvbnN0IGRvdWJsZSBTY2FsZUZhY3RvciA9IDgwO1xyXG4gICAgICAgIHByaXZhdGUgY29uc3QgaW50IFRyZWVZT2Zmc2V0ID0gNDIwO1xyXG5cclxuICAgICAgICBwdWJsaWMgZG91YmxlIEdyb3d0aENvbnRyb2wgeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBkb3VibGUgV2F0ZXJBbW91bnQgeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBkb3VibGUgVGhpY2tuZXNzQ29udHJvbCB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIGRvdWJsZSBXYXRlckRlbHRhIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgYm9vbCBJc0RlYWQgeyBnZXQ7IHNldDsgfVxyXG5wcml2YXRlIHN0cmluZyBTa3lDb2xvclxyXG57XHJcbiAgICBnZXRcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gSXNEZWFkID8gXCIjNDQ0XCIgOiBcIiNCMkZGRkZcIjtcclxuICAgIH1cclxufXByaXZhdGUgc3RyaW5nIEdyYXNzQmFja2dyb3VuZENvbG9yXHJcbntcclxuICAgIGdldFxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBJc0RlYWQgPyBcIiMzMzNcIiA6IFwiIzdFQzg1MFwiO1xyXG4gICAgfVxyXG59cHJpdmF0ZSBzdHJpbmcgR3Jhc3NDb2xvclxyXG57XHJcbiAgICBnZXRcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gSXNEZWFkID8gXCIjMTExXCIgOiBcIiMyMDY0MTFcIjtcclxuICAgIH1cclxufVxyXG4gICAgICAgIHB1YmxpYyBBcHAoSFRNTENhbnZhc0VsZW1lbnQgY2FudmFzLCBIVE1MSW1hZ2VFbGVtZW50IHdhdGVyLCBIVE1MSW1hZ2VFbGVtZW50IHJlc2V0LCBpbnQgc2VlZClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuY2FudmFzID0gY2FudmFzO1xyXG4gICAgICAgICAgICB0aGlzLndhdGVyID0gd2F0ZXI7XHJcbiAgICAgICAgICAgIHRoaXMucmVzZXQgPSByZXNldDtcclxuICAgICAgICAgICAgY2FudmFzLldpZHRoID0gQ2FudmFzV2lkdGg7XHJcbiAgICAgICAgICAgIGNhbnZhcy5IZWlnaHQgPSBDYW52YXNIZWlnaHQ7XHJcblxyXG4gICAgICAgICAgICBwaXhlbFNjcmVlbiA9IG5ldyBQaXhlbFNjcmVlbigpO1xyXG5cclxuICAgICAgICAgICAgY3R4ID0gY2FudmFzLkdldENvbnRleHQoQ2FudmFzVHlwZXMuQ2FudmFzQ29udGV4dDJEVHlwZS5DYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpO1xyXG5cclxuICAgICAgICAgICAgcGl4ZWxTY3JlZW4uU2V0UGl4ZWwoMCwgMCwgdHJ1ZSk7XHJcblxyXG4gICAgICAgICAgICAvL2ZvciAodmFyIHkgPSAwOyB5IDwgcGl4ZWxTY3JlZW4uSGVpZ2h0OyB5KyspXHJcbiAgICAgICAgICAgIC8ve1xyXG4gICAgICAgICAgICAvLyAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHBpeGVsU2NyZWVuLldpZHRoOyB4KyspXHJcbiAgICAgICAgICAgIC8vICAgIHtcclxuICAgICAgICAgICAgLy8gICAgICAgIHBpeGVsU2NyZWVuLlNldFBpeGVsKHgsIHksIHRydWUpO1xyXG4gICAgICAgICAgICAvLyAgICB9XHJcbiAgICAgICAgICAgIC8vfVxyXG5cclxuICAgICAgICAgICAgLy9jdHguUHV0SW1hZ2VEYXRhKHBpeGVsU2NyZWVuLkltYWdlRGF0YSwgMCwgMCk7XHJcblxyXG5cclxuXHJcbiAgICAgICAgICAgIFVwZGF0ZVNlZWQoc2VlZCk7XHJcblxyXG4gICAgICAgICAgICB0cmVlRHJhd2luZ0NvbnRleHQgPSBuZXcgVHJlZURyYXdpbmdDb250ZXh0KGN0eClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgU2NhbGVGYWN0b3IgPSBTY2FsZUZhY3RvcixcclxuICAgICAgICAgICAgICAgIFN0YXJ0WCA9IENhbnZhc1dpZHRoIC8gMixcclxuICAgICAgICAgICAgICAgIFN0YXJ0WSA9IFRyZWVZT2Zmc2V0LFxyXG4gICAgICAgICAgICAgICAgTGVhZkxpbWl0ID0gMC4wMlxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgVXBkYXRlU2VlZChpbnQgbmV3U2VlZClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciB0cmVlUm5kU291cmNlID0gbmV3IFJhbmRvbVdyYXBwZXIobmV3U2VlZCk7XHJcbiAgICAgICAgICAgIHZhciB0cmVlQnVpbGRlciA9IG5ldyBUcmVlQnVpbGRlcih0cmVlUm5kU291cmNlKTtcclxuICAgICAgICAgICAgdHJ1bmsgPSB0cmVlQnVpbGRlci5CdWlsZFRyZWUoKTtcclxuXHJcbiAgICAgICAgICAgIGdyYXNzUmFuZG9tID0gbmV3IFJhbmRvbVdyYXBwZXIobmV3U2VlZCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIGJvb2wgd2F0ZXJJbmZvV2FzU2hvd24gPSBmYWxzZTtcclxuICAgICAgICBwcml2YXRlIGJvb2wgd2F0ZXJJbmZvRGVhY3RpdmF0ZWQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgUmVkcmF3KClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGdyYXNzUmFuZG9tLlJlc2V0KCk7XHJcblxyXG4gICAgICAgICAgICBjdHguRmlsbFN0eWxlID0gU2t5Q29sb3I7XHJcbiAgICAgICAgICAgIGN0eC5DbGVhclJlY3QoMCwgMCwgNTEyLCA1MTIpO1xyXG4gICAgICAgICAgICBjdHguRmlsbFJlY3QoMCwgMCwgNTEyLCA1MTIpO1xyXG5cclxuICAgICAgICAgICAgdHJlZURyYXdpbmdDb250ZXh0Lkdyb3d0aEZhY3RvciA9IEVhc2luZ0hlbHBlci5FYXNlT3V0UXVhZChHcm93dGhDb250cm9sICogMC43NSArIDAuMjUpO1xyXG4gICAgICAgICAgICB0cmVlRHJhd2luZ0NvbnRleHQuTGVhZkZhY3RvciA9IFRoaWNrbmVzc0NvbnRyb2wgKiAwLjk7XHJcbiAgICAgICAgICAgIHRyZWVEcmF3aW5nQ29udGV4dC5Jc0RlYWQgPSBJc0RlYWQ7XHJcblxyXG4gICAgICAgICAgICB2YXIgZ3Jhc3NIZWlnaHQgPSBUcmVlWU9mZnNldCAtIDUwO1xyXG4gICAgICAgICAgICBjdHguRmlsbFN0eWxlID0gR3Jhc3NCYWNrZ3JvdW5kQ29sb3I7XHJcbiAgICAgICAgICAgIGN0eC5GaWxsUmVjdCgwLCBncmFzc0hlaWdodCwgQ2FudmFzV2lkdGgsIENhbnZhc0hlaWdodCAtIGdyYXNzSGVpZ2h0KTtcclxuXHJcbiAgICAgICAgICAgIHZhciBncmFzc0ZvcmVncm91bmRMaW1pdCA9IFRyZWVZT2Zmc2V0IC0gMjA7XHJcblxyXG4gICAgICAgICAgICBmb3IgKHZhciB5ID0gZ3Jhc3NIZWlnaHQgLSAxMDsgeSA8IGdyYXNzRm9yZWdyb3VuZExpbWl0OyB5ICs9IDUpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIERyYXdHcmFzcyh5LCA1MTIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0cmVlRHJhd2luZ0NvbnRleHQuRHJhd1RyZWUodHJ1bmspO1xyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgeSA9IGdyYXNzRm9yZWdyb3VuZExpbWl0OyB5IDwgQ2FudmFzSGVpZ2h0OyB5ICs9IDUpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIERyYXdHcmFzcyh5LCA1MTIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBEcmF3V2F0ZXJIVUQoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgdm9pZCBEcmF3V2F0ZXJIVUQoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgLy8gZHJhdyBodWRcclxuICAgICAgICAgICAgdmFyIGhlaWdodCA9IDMwO1xyXG4gICAgICAgICAgICB2YXIgbWFyZ2luID0gMTA7XHJcbiAgICAgICAgICAgIHZhciBtYXJnaW5MZWZ0ID0gNTA7XHJcbiAgICAgICAgICAgIHZhciBtYXJnaW5Cb3R0b20gPSAyMDtcclxuICAgICAgICAgICAgdmFyIHBhZGRpbmcgPSA1O1xyXG5cclxuICAgICAgICAgICAgdmFyIHdhdGVyUHJlZGl0aW9uID0gMDtcclxuXHJcbiAgICAgICAgICAgIGlmIChXYXRlckFtb3VudCArIFdhdGVyRGVsdGEgPiAxKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB3YXRlclByZWRpdGlvbiA9IDE7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICghSXNEZWFkKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAvLyB3aGl0ZSBodWQgYmdcclxuICAgICAgICAgICAgICAgIGN0eC5GaWxsU3R5bGUgPSBcIiNCMkZGRkY2MFwiO1xyXG4gICAgICAgICAgICAgICAgY3R4LkZpbGxSZWN0KDAgKyBtYXJnaW5MZWZ0LCBDYW52YXNIZWlnaHQgLSBtYXJnaW5Cb3R0b20gLSAyICogcGFkZGluZyAtIGhlaWdodCwgQ2FudmFzV2lkdGggLSBtYXJnaW4gLSBtYXJnaW5MZWZ0LCBoZWlnaHQgKyAyICogcGFkZGluZyk7XHJcblxyXG4gICAgICAgICAgICAgICAgY3R4LkZpbGxTdHlsZSA9IFwiIzAwNzdCRTgwXCI7XHJcbiAgICAgICAgICAgICAgICBjdHguRmlsbFJlY3QoMCArIG1hcmdpbkxlZnQgKyBwYWRkaW5nLCBDYW52YXNIZWlnaHQgLSBtYXJnaW5Cb3R0b20gLSBwYWRkaW5nIC0gaGVpZ2h0LCAoQ2FudmFzV2lkdGggLSAyICogcGFkZGluZyAtIG1hcmdpbiAtIG1hcmdpbkxlZnQpICogd2F0ZXJQcmVkaXRpb24sIGhlaWdodCk7XHJcblxyXG4gICAgICAgICAgICAgICAgY3R4LkZpbGxTdHlsZSA9IFwiIzAwNzdCRVwiO1xyXG4gICAgICAgICAgICAgICAgY3R4LkZpbGxSZWN0KDAgKyBtYXJnaW5MZWZ0ICsgcGFkZGluZywgQ2FudmFzSGVpZ2h0IC0gbWFyZ2luQm90dG9tIC0gcGFkZGluZyAtIGhlaWdodCwgKGludCkoKENhbnZhc1dpZHRoIC0gMiAqIHBhZGRpbmcgLSBtYXJnaW4gLSBtYXJnaW5MZWZ0KSAqIFdhdGVyQW1vdW50KSwgaGVpZ2h0KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyIGljb24gPSB3YXRlcjtcclxuICAgICAgICAgICAgdmFyIGljb25MZWZ0ID0gNTtcclxuXHJcbiAgICAgICAgICAgIGlmIChJc0RlYWQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGljb25MZWZ0ID0gMjA7XHJcbiAgICAgICAgICAgICAgICBpY29uID0gcmVzZXQ7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGN0eC5JbWFnZVNtb290aGluZ0VuYWJsZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICBjdHguRHJhd0ltYWdlKGljb24sIGljb25MZWZ0LCBDYW52YXNIZWlnaHQgLSA2NCAtIDE1LCA2NGQsIDY0ZCk7XHJcblxyXG4gICAgICAgICAgICBjdHguRmlsbFN0eWxlID0gXCIjMDAwXCI7XHJcbiAgICAgICAgICAgIGN0eC5Gb250ID0gXCJib2xkIDE2cHggQXJpYWwsIHNhbnMtc2VyaWZcIjtcclxuXHJcbiAgICAgICAgICAgIHZhciB0ZXh0ID0gXCJcIjtcclxuXHJcbiAgICAgICAgICAgIGlmICghSXNEZWFkKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB2YXIgbGFzdFdhdGVyaW5mbyA9IHdhdGVySW5mb1dhc1Nob3duO1xyXG4gICAgICAgICAgICAgICAgd2F0ZXJJbmZvV2FzU2hvd24gPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoKFdhdGVyQW1vdW50IDwgMC41ICYmICF3YXRlckluZm9EZWFjdGl2YXRlZCkgfHwgV2F0ZXJBbW91bnQgPCAwLjAwMSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB0ZXh0ID0gXCLir4cgY2xpY2sgdG8gd2F0ZXIgeW91ciB0cmVlXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgd2F0ZXJJbmZvV2FzU2hvd24gPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoV2F0ZXJBbW91bnQgPiAwLjk5OSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB0ZXh0ID0gXCJzd2FtcGVkXCI7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGxhc3RXYXRlcmluZm8gJiYgIXdhdGVySW5mb1dhc1Nob3duKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHdhdGVySW5mb0RlYWN0aXZhdGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGN0eC5Gb250ID0gXCJib2xkIDI0cHggQXJpYWwsIHNhbnMtc2VyaWZcIjtcclxuICAgICAgICAgICAgICAgIG1hcmdpbkxlZnQgKz0gMzA7XHJcbiAgICAgICAgICAgICAgICAvL3RleHQgPSBcIuKvhyBjbGljayB0byByZXN0YXJ0XCI7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGN0eC5GaWxsVGV4dCh0ZXh0LCBtYXJnaW5MZWZ0ICsgcGFkZGluZyArIDE1LCBDYW52YXNIZWlnaHQgLSBtYXJnaW5Cb3R0b20gLSBwYWRkaW5nIC0gMTApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSB2b2lkIERyYXdHcmFzcyhpbnQgeSwgaW50IGFtb3VudClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBncmFzc1NjYWxlID0gMC4yICogU2NhbGVGYWN0b3I7XHJcblxyXG4gICAgICAgICAgICBjdHguU3Ryb2tlU3R5bGUgPSBHcmFzc0NvbG9yO1xyXG4gICAgICAgICAgICBjdHguTGluZVdpZHRoID0gZ3Jhc3NTY2FsZSAqIDAuMDI1O1xyXG5cclxuICAgICAgICAgICAgY3R4LkJlZ2luUGF0aCgpO1xyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhbW91bnQ7IGkrKylcclxuICAgICAgICAgICAge1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciB4ID0gZ3Jhc3NSYW5kb20uTmV4dERvdWJsZSgpICogQ2FudmFzV2lkdGg7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIG9mZnNldHggPSBncmFzc1JhbmRvbS5OZXh0RG91YmxlKCkgLSAwLjU7XHJcbiAgICAgICAgICAgICAgICB2YXIgb2Zmc2V0WSA9IGdyYXNzUmFuZG9tLk5leHREb3VibGUoKSAtIDAuNTtcclxuICAgICAgICAgICAgICAgIHZhciBoZWlnaHQgPSBncmFzc1JhbmRvbS5OZXh0RG91YmxlKCkgKiAwLjcgKyAwLjM7XHJcblxyXG4gICAgICAgICAgICAgICAgY3R4Lk1vdmVUbyh4LCB5ICsgb2Zmc2V0WSAqIGdyYXNzU2NhbGUpO1xyXG4gICAgICAgICAgICAgICAgY3R4LkxpbmVUbyh4ICsgb2Zmc2V0eCAqIGdyYXNzU2NhbGUsIHkgKyBvZmZzZXRZICogZ3Jhc3NTY2FsZSArIGhlaWdodCAqIGdyYXNzU2NhbGUpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjdHguQ2xvc2VQYXRoKCk7XHJcbiAgICAgICAgICAgIGN0eC5TdHJva2UoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBjbGFzcyBFYXNpbmdIZWxwZXJcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgc3RhdGljIGRvdWJsZSBFYXNlT3V0U2luZShkb3VibGUgeClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJldHVybiBNYXRoLlNpbih4ICogTWF0aC5QSSAvIDIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBkb3VibGUgRWFzZU91dFF1YWQoZG91YmxlIHgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gMSAtICgxIC0geCkgKiAoMSAtIHgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBkb3VibGUgRWFzZU91dFF1aW50KGRvdWJsZSB4KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuIDEgLSBNYXRoLlBvdygxIC0geCwgNSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGRvdWJsZSBFYXNlSW5RdWFkKGRvdWJsZSB4KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuIHggKiB4ICogeCAqIHg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGRvdWJsZSBFYXNlSW5RdWFkT2Zmc2V0KGRvdWJsZSB4KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgeCA9IHggKiAwLjUgKyAwLjU7XHJcbiAgICAgICAgICAgIHJldHVybiB4ICogeCAqIHggKiB4O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBkb3VibGUgRWFzZUxpbmVhcihkb3VibGUgeClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJldHVybiB4O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBkb3VibGUgRWFzZUluRXhwKGRvdWJsZSBmYWN0b3IpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAoZmFjdG9yIDw9IDApXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gTWF0aC5Qb3coMiwgMTAgKiBmYWN0b3IgLSAxMCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjbGFzcyBUcmVlRHJhd2luZ0NvbnRleHRcclxuICAgIHtcclxuICAgICAgICBwcml2YXRlIGNvbnN0IGRvdWJsZSBUQVUgPSA2LjI4MzE4NTMwNzE3OTU4NjI7XHJcblxyXG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEIGN0eDtcclxuXHJcbiAgICAgICAgcHVibGljIFRyZWVEcmF3aW5nQ29udGV4dChDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgY3R4KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5jdHggPSBjdHggPz8gKChTeXN0ZW0uRnVuYzxDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ+KSgoKT0+e3Rocm93IG5ldyBBcmd1bWVudE51bGxFeGNlcHRpb24oXCJjdHhcIik7fSkpKCk7XHJcbiAgICAgICAgfVxyXG5wcml2YXRlIGludCBEZXB0aExpbWl0XHJcbntcclxuICAgIGdldFxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiAxMjtcclxuICAgIH1cclxufVxyXG4gICAgICAgIHB1YmxpYyBkb3VibGUgR3Jvd3RoRmFjdG9yIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgZG91YmxlIFNjYWxlRmFjdG9yIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgZG91YmxlIExlYWZMaW1pdCB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIGRvdWJsZSBTdGFydFggeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBkb3VibGUgU3RhcnRZIHsgZ2V0OyBzZXQ7IH1cclxucHJpdmF0ZSBkb3VibGUgVGhpY2tuZXNzTGltaXRcclxue1xyXG4gICAgZ2V0XHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIExlYWZMaW1pdCAqICgxIC0gTGVhZkZhY3Rvcik7XHJcbiAgICB9XHJcbn0gICAgICAgIHB1YmxpYyBkb3VibGUgTGVhZkZhY3RvciB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIGJvb2wgSXNEZWFkIHsgZ2V0OyBzZXQ7IH1cclxucHJpdmF0ZSBzdHJpbmcgQnJhbmNoQ29sb3Jcclxue1xyXG4gICAgZ2V0XHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIElzRGVhZCA/IFwiIzAwMFwiIDogXCIjNDIxMjA4XCI7XHJcbiAgICB9XHJcbn1cclxuICAgICAgICBwdWJsaWMgdm9pZCBEcmF3VHJlZShUcmVlU2VnbWVudCB0cmVlVHJ1bmspXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAodHJlZVRydW5rID09IG51bGwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBBcmd1bWVudE51bGxFeGNlcHRpb24oXCJ0cmVlVHJ1bmtcIik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIERyYXdTZWdtZW50SW50ZXJuYWwodHJlZVRydW5rLCBTdGFydFgsIFN0YXJ0WSwgMC4yNSAqIFRBVSwgZG91YmxlLk5hTik7XHJcbiAgICAgICAgfVxyXG5wcml2YXRlIEZ1bmM8ZG91YmxlLCBkb3VibGU+IEVhc2VEZXB0aFxyXG57XHJcbiAgICBnZXRcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gRWFzaW5nSGVscGVyLkVhc2VJblF1YWRPZmZzZXQ7XHJcbiAgICB9XHJcbn1wcml2YXRlIEZ1bmM8ZG91YmxlLCBkb3VibGU+IEVhc2VUaGlja25lc3Ncclxue1xyXG4gICAgZ2V0XHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIEVhc2luZ0hlbHBlci5FYXNlSW5RdWFkT2Zmc2V0O1xyXG4gICAgfVxyXG59cHJpdmF0ZSBGdW5jPGRvdWJsZSwgZG91YmxlPiBFYXNlRGV2aWF0aW9uXHJcbntcclxuICAgIGdldFxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBFYXNpbmdIZWxwZXIuRWFzZUxpbmVhcjtcclxuICAgIH1cclxufVxyXG4gICAgICAgIHByaXZhdGUgdm9pZCBEcmF3U2VnbWVudEludGVybmFsKFRyZWVTZWdtZW50IGN1cnJlbnRTZWdtZW50LCBkb3VibGUgeCwgZG91YmxlIHksIGRvdWJsZSBsYXN0QnJhbmNoQWJzb2x1dGVBbmdsZSwgZG91YmxlIGxhc3RUaGlja25lc3MpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgZmxvYXRpbmdEZXB0aCA9IERlcHRoTGltaXQgKiBFYXNlRGVwdGgoR3Jvd3RoRmFjdG9yKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBsb3dlckRlcHRoID0gKGludClmbG9hdGluZ0RlcHRoO1xyXG4gICAgICAgICAgICB2YXIgdXBwZXJEZXB0aCA9IGxvd2VyRGVwdGggKyAxO1xyXG5cclxuICAgICAgICAgICAgaWYgKGN1cnJlbnRTZWdtZW50LkRlcHRoID4gdXBwZXJEZXB0aClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YXIgZGVwdGhMZW5ndGhTY2FsZSA9IE1hdGguTWF4KE1hdGguTWluKDEuMCwgZmxvYXRpbmdEZXB0aCAtIGN1cnJlbnRTZWdtZW50LkRlcHRoKSwgMCk7XHJcblxyXG4gICAgICAgICAgICB2YXIgZWZmZWN0aXZlRGV2aWF0aW9uQW5nbGUgPSBjdXJyZW50U2VnbWVudC5EZXZpYXRpb25BbmdsZSAqIChFYXNlRGV2aWF0aW9uKEdyb3d0aEZhY3RvcikgKiAwLjMgKyAwLjcpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGN1cnJlbnRCcmFuY2hBYnNvbHV0ZUFuZ2xlID0gbGFzdEJyYW5jaEFic29sdXRlQW5nbGUgKyBlZmZlY3RpdmVEZXZpYXRpb25BbmdsZTtcclxuICAgICAgICAgICAgdmFyIGxlbmd0aCA9IGN1cnJlbnRTZWdtZW50Lkxlbmd0aCAqIEdyb3d0aEZhY3RvciAqIGRlcHRoTGVuZ3RoU2NhbGU7XHJcblxyXG4gICAgICAgICAgICB2YXIgaW50ZXJuYWxUaGlja25lc3MgPSBjdXJyZW50U2VnbWVudC5UaGlja25lc3MgKiBHcm93dGhGYWN0b3IgKiBFYXNlVGhpY2tuZXNzKEdyb3d0aEZhY3RvcikgKiBkZXB0aExlbmd0aFNjYWxlO1xyXG5cclxuICAgICAgICAgICAgaWYgKGludGVybmFsVGhpY2tuZXNzIDwgVGhpY2tuZXNzTGltaXQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGludGVybmFsVGhpY2tuZXNzID4gTGVhZkxpbWl0KVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAvLyBicmFuY2hcclxuICAgICAgICAgICAgICAgIGN0eC5TdHJva2VTdHlsZSA9IEJyYW5jaENvbG9yO1xyXG4gICAgICAgICAgICAgICAgY3R4LkZpbGxTdHlsZSA9IEJyYW5jaENvbG9yO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgLy8gbGVhZlxyXG4gICAgICAgICAgICAgICAgY3R4LlN0cm9rZVN0eWxlID0gXCIjMjA2NDExXCI7XHJcbiAgICAgICAgICAgICAgICBjdHguRmlsbFN0eWxlID0gXCIjMjA2NDExXCI7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChkb3VibGUuSXNOYU4obGFzdFRoaWNrbmVzcykpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGxhc3RUaGlja25lc3MgPSBpbnRlcm5hbFRoaWNrbmVzcztcclxuICAgICAgICAgICAgfVxyXG5CcmlkZ2UuU2NyaXB0LkRlY29uc3RydWN0KERyYXdTZWdtZW50VG9DYW52YXMyKHgsIHksIGludGVybmFsVGhpY2tuZXNzLCBjdXJyZW50QnJhbmNoQWJzb2x1dGVBbmdsZSwgbGFzdFRoaWNrbmVzcywgbGFzdEJyYW5jaEFic29sdXRlQW5nbGUsIGxlbmd0aCksIG91dCB4LCBvdXQgeSk7XHJcblxyXG4gICAgICAgICAgICBmb3JlYWNoICh2YXIgYnJhbmNoIGluIGN1cnJlbnRTZWdtZW50LkJyYW5jaGVzKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBEcmF3U2VnbWVudEludGVybmFsKGJyYW5jaCwgeCwgeSwgY3VycmVudEJyYW5jaEFic29sdXRlQW5nbGUsIGludGVybmFsVGhpY2tuZXNzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBTeXN0ZW0uVmFsdWVUdXBsZTxkb3VibGUgLGRvdWJsZSA+IERyYXdTZWdtZW50VG9DYW52YXMoXHJcbiAgICAgICAgICAgIGRvdWJsZSB4LFxyXG4gICAgICAgICAgICBkb3VibGUgeSxcclxuICAgICAgICAgICAgZG91YmxlIHRoaWNrbmVzcyxcclxuICAgICAgICAgICAgZG91YmxlIGFic29sdXRlQW5nbGUsXHJcbiAgICAgICAgICAgIGRvdWJsZSBwcmV2aW91c1RoaWNrbmVzcyxcclxuICAgICAgICAgICAgZG91YmxlIHByZXZpb3VzQW5nbGUsXHJcbiAgICAgICAgICAgIGRvdWJsZSBsZW5ndGhcclxuICAgICAgICApXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjdHguQmVnaW5QYXRoKCk7XHJcbiAgICAgICAgICAgIGN0eC5Nb3ZlVG8oeCwgeSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgZHggPSBNYXRoLkNvcyhhYnNvbHV0ZUFuZ2xlKSAqIGxlbmd0aCAqIFNjYWxlRmFjdG9yO1xyXG4gICAgICAgICAgICB2YXIgZHkgPSBNYXRoLlNpbihhYnNvbHV0ZUFuZ2xlKSAqIGxlbmd0aCAqIFNjYWxlRmFjdG9yO1xyXG5cclxuICAgICAgICAgICAgeCArPSBkeDtcclxuICAgICAgICAgICAgeSArPSAtZHk7XHJcblxyXG4gICAgICAgICAgICBjdHguTGluZVRvKHgsIHkpO1xyXG4gICAgICAgICAgICBjdHguTGluZVdpZHRoID0gdGhpY2tuZXNzICogU2NhbGVGYWN0b3I7XHJcbiAgICAgICAgICAgIGN0eC5DbG9zZVBhdGgoKTtcclxuXHJcbiAgICAgICAgICAgIGN0eC5TdHJva2UoKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgU3lzdGVtLlZhbHVlVHVwbGU8ZG91YmxlLCBkb3VibGU+KHgsIHkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBTeXN0ZW0uVmFsdWVUdXBsZTxkb3VibGUgLGRvdWJsZSA+IERyYXdTZWdtZW50VG9DYW52YXMyKFxyXG4gICAgICAgICAgICBkb3VibGUgeCxcclxuICAgICAgICAgICAgZG91YmxlIHksXHJcbiAgICAgICAgICAgIGRvdWJsZSB0aGlja25lc3MsXHJcbiAgICAgICAgICAgIGRvdWJsZSBhYnNvbHV0ZUFuZ2xlLFxyXG4gICAgICAgICAgICBkb3VibGUgcHJldmlvdXNUaGlja25lc3MsXHJcbiAgICAgICAgICAgIGRvdWJsZSBwcmV2aW91c0FuZ2xlLFxyXG4gICAgICAgICAgICBkb3VibGUgbGVuZ3RoXHJcbiAgICAgICAgKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIGR4ID0gTWF0aC5Db3MoYWJzb2x1dGVBbmdsZSkgKiBsZW5ndGggKiBTY2FsZUZhY3RvcjtcclxuICAgICAgICAgICAgdmFyIGR5ID0gTWF0aC5TaW4oYWJzb2x1dGVBbmdsZSkgKiBsZW5ndGggKiBTY2FsZUZhY3RvcjtcclxuXHJcbiAgICAgICAgICAgIHZhciBuZXdYID0geCArIGR4O1xyXG4gICAgICAgICAgICB2YXIgbmV3WSA9IHkgLSBkeTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlja25lc3MgPiBMZWFmTGltaXQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIC8vIGNhbGMgb2xkIGF0dGFjaHBvaW50c1xyXG4gICAgICAgICAgICAgICAgdmFyIG9sZE5vcm1hbCA9IHByZXZpb3VzQW5nbGUgLSBUQVUgKiAwLjI1O1xyXG4gICAgICAgICAgICAgICAgdmFyIG9sZE5vcm1hbFggPSBNYXRoLkNvcyhvbGROb3JtYWwpICogcHJldmlvdXNUaGlja25lc3MgLyAyO1xyXG4gICAgICAgICAgICAgICAgdmFyIG9sZE5vcm1hbFkgPSAtTWF0aC5TaW4ob2xkTm9ybWFsKSAqIHByZXZpb3VzVGhpY2tuZXNzIC8gMjtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBjYWxjIG5ldyBhdHRhY2hwb2ludHNcclxuICAgICAgICAgICAgICAgIHZhciBuZXdOb3JtYWwgPSBhYnNvbHV0ZUFuZ2xlICsgVEFVICogMC4yNTtcclxuICAgICAgICAgICAgICAgIHZhciBuZXdOb3JtYWxYID0gTWF0aC5Db3MobmV3Tm9ybWFsKSAqIHRoaWNrbmVzcyAvIDI7XHJcbiAgICAgICAgICAgICAgICB2YXIgbmV3Tm9ybWFsWSA9IC1NYXRoLlNpbihuZXdOb3JtYWwpICogdGhpY2tuZXNzIC8gMjtcclxuXHJcbiAgICAgICAgICAgICAgICBjdHguQmVnaW5QYXRoKCk7XHJcbiAgICAgICAgICAgICAgICBjdHguTW92ZVRvKHggKyBvbGROb3JtYWxYICogU2NhbGVGYWN0b3IsIHkgKyBvbGROb3JtYWxZICogU2NhbGVGYWN0b3IpO1xyXG4gICAgICAgICAgICAgICAgY3R4LkxpbmVUbyhuZXdYIC0gbmV3Tm9ybWFsWCAqIFNjYWxlRmFjdG9yLCBuZXdZIC0gbmV3Tm9ybWFsWSAqIFNjYWxlRmFjdG9yKTtcclxuICAgICAgICAgICAgICAgIGN0eC5MaW5lVG8obmV3WCArIG5ld05vcm1hbFggKiBTY2FsZUZhY3RvciwgbmV3WSArIG5ld05vcm1hbFkgKiBTY2FsZUZhY3Rvcik7XHJcbiAgICAgICAgICAgICAgICBjdHguTGluZVRvKHggLSBvbGROb3JtYWxYICogU2NhbGVGYWN0b3IsIHkgLSBvbGROb3JtYWxZICogU2NhbGVGYWN0b3IpO1xyXG5cclxuICAgICAgICAgICAgICAgIGN0eC5DbG9zZVBhdGgoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvL2N0eC5TdHJva2UoKTtcclxuICAgICAgICAgICAgICAgIGN0eC5GaWxsKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgY3R4LkJlZ2luUGF0aCgpO1xyXG4gICAgICAgICAgICAgICAgY3R4LkFyYyhuZXdYLCBuZXdZLCB0aGlja25lc3MgLyAyICogU2NhbGVGYWN0b3IsIDAsIFRBVSk7XHJcbiAgICAgICAgICAgICAgICBjdHguQ2xvc2VQYXRoKCk7XHJcbiAgICAgICAgICAgICAgICBjdHguRmlsbCgpO1xyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGN0eC5CZWdpblBhdGgoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBjdHguTW92ZVRvKHgsIHkpO1xyXG4gICAgICAgICAgICAgICAgY3R4LkxpbmVUbyhuZXdYLCBuZXdZKTtcclxuICAgICAgICAgICAgICAgIGN0eC5MaW5lV2lkdGggPSB0aGlja25lc3MgKiBTY2FsZUZhY3RvcjtcclxuXHJcbiAgICAgICAgICAgICAgICBjdHguQ2xvc2VQYXRoKCk7XHJcbiAgICAgICAgICAgICAgICBjdHguU3Ryb2tlKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgU3lzdGVtLlZhbHVlVHVwbGU8ZG91YmxlLCBkb3VibGU+KG5ld1gsIG5ld1kpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY2xhc3MgUGl4ZWxTY3JlZW5TZWdtZW50V3JpdGVyIDogSVBpeGVsU2NyZWVuV3JpdGVyXHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIFBpeGVsU2NyZWVuU2VnbWVudFdyaXRlcihJUGl4ZWxTY3JlZW5Xcml0ZXIgcGl4ZWxTY3JlZW5Xcml0ZXIpXHJcbiAgICAgICAge1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIFNldFBpeGVsKGludCB4LCBpbnQgeSwgYm9vbCBzZXQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgTm90SW1wbGVtZW50ZWRFeGNlcHRpb24oKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNsYXNzIFBpeGVsU2NyZWVuXHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIFBpeGVsU2NyZWVuKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIEltYWdlRGF0YSA9IG5ldyBJbWFnZURhdGEoKHVpbnQpV2lkdGgsICh1aW50KUhlaWdodCk7XHJcblxyXG4gICAgICAgICAgICAvLyBTZXQgYWxwaGEgY2hhbm5lbCB0byB2aXNpYmxlIGFuZCBwaXhlbCB0byB3aGl0ZTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBJbWFnZURhdGEuRGF0YS5MZW5ndGg7IGkgKz0gNClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgSW1hZ2VEYXRhLkRhdGFbaSArIDBdID0gMjU1O1xyXG4gICAgICAgICAgICAgICAgSW1hZ2VEYXRhLkRhdGFbaSArIDFdID0gMjU1O1xyXG4gICAgICAgICAgICAgICAgSW1hZ2VEYXRhLkRhdGFbaSArIDJdID0gMjU1O1xyXG4gICAgICAgICAgICAgICAgSW1hZ2VEYXRhLkRhdGFbaSArIDNdID0gMjU1O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5wdWJsaWMgaW50IFdpZHRoXHJcbntcclxuICAgIGdldFxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiA2NDtcclxuICAgIH1cclxufXB1YmxpYyBpbnQgSGVpZ2h0XHJcbntcclxuICAgIGdldFxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiA2NDtcclxuICAgIH1cclxufVxyXG4gICAgICAgIHB1YmxpYyBJbWFnZURhdGEgSW1hZ2VEYXRhIHsgZ2V0OyBwcml2YXRlIHNldDsgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBTZXRQaXhlbChpbnQgeCwgaW50IHksIGJvb2wgc2V0KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKHggPCAwIHx8IHggPj0gV2lkdGggfHwgeSA8IDAgfHwgeSA+PSBIZWlnaHQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyIHZhbHVlID0gc2V0ID8gKGJ5dGUpMCA6IChieXRlKTI1NTtcclxuICAgICAgICAgICAgdmFyIGFycmF5UG9zaXRpb24gPSAoeSAqIFdpZHRoICsgeCkgKiA0O1xyXG5cclxuICAgICAgICAgICAgLy8gU2V0IFJHQiB0byBzYW1lIGNvbG9yIChibGFjayAmIHdoaXRlIG9ubHkpXHJcbiAgICAgICAgICAgIEltYWdlRGF0YS5EYXRhW2FycmF5UG9zaXRpb24gKyAwXSA9IHZhbHVlO1xyXG4gICAgICAgICAgICBJbWFnZURhdGEuRGF0YVthcnJheVBvc2l0aW9uICsgMV0gPSB2YWx1ZTtcclxuICAgICAgICAgICAgSW1hZ2VEYXRhLkRhdGFbYXJyYXlQb3NpdGlvbiArIDJdID0gdmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsInVzaW5nIEJyaWRnZTtcclxudXNpbmcgQnJpZGdlLkh0bWw1O1xyXG51c2luZyBTeXN0ZW07XHJcblxyXG5uYW1lc3BhY2UgV2lzY2hpLkxENDYuS2VlcEl0QWxpdmUuQnJpZGdlTmV0XHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBQcm9ncmFtXHJcbiAgICB7XHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgSFRNTENhbnZhc0VsZW1lbnQgY2FudmFzO1xyXG5cclxuICAgICAgICBbUmVhZHldXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyB2b2lkIE1haW4oKVxyXG4gICAgICAgIHtcclxuU3lzdGVtLkFjdGlvbiBVcGRhdGUgPSBudWxsO1xuICAgICAgICAgICAgY2FudmFzID0gRG9jdW1lbnQuR2V0RWxlbWVudEJ5SWQoXCJjYW52YXNcIikgYXMgSFRNTENhbnZhc0VsZW1lbnQ7XHJcblxyXG4gICAgICAgICAgICBpZiAoY2FudmFzID09IG51bGwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyIHdhdGVyID0gbmV3IEhUTUxJbWFnZUVsZW1lbnQoKSB7IFNyYyA9IFwiaW1nL3dhdGVyLnBuZ1wiIH07XHJcbiAgICAgICAgICAgIHZhciByZXNldCA9IG5ldyBIVE1MSW1hZ2VFbGVtZW50KCkgeyBTcmMgPSBcImltZy9yZXNldC5wbmdcIiB9O1xyXG5cclxuICAgICAgICAgICAgdmFyIGNvbmZpZyA9IFRyZWVDb25maWd1cmF0aW9ucy5SZWxlYXNlQ29uZmlnO1xyXG4gICAgICAgICAgICB2YXIgc3RhcnRNcyA9IERhdGUuTm93KCk7XHJcblxyXG4gICAgICAgICAgICB2YXIgdHJlZUJlaGF2aW91ciA9IExvYWRGcm9tTG9jYWxTdG9yYWdlKGNvbmZpZyk7XHJcbiAgICAgICAgICAgIHZhciBhcHAgPSBuZXcgQXBwKGNhbnZhcywgd2F0ZXIsIHJlc2V0LCB0cmVlQmVoYXZpb3VyLlNlZWQpO1xyXG5VcGRhdGUgPSAoKSA9PlxyXG57XHJcbiAgICB0cmVlQmVoYXZpb3VyLlVwZGF0ZShEYXRlLk5vdygpKTtcclxuICAgIGFwcC5Hcm93dGhDb250cm9sID0gdHJlZUJlaGF2aW91ci5Hcm93dGg7XHJcbiAgICBhcHAuV2F0ZXJBbW91bnQgPSBNYXRoLk1pbigxLCB0cmVlQmVoYXZpb3VyLldhdGVyTGV2ZWwpO1xyXG4gICAgYXBwLlRoaWNrbmVzc0NvbnRyb2wgPSB0cmVlQmVoYXZpb3VyLkhlYWx0aDtcclxuICAgIGFwcC5XYXRlckRlbHRhID0gdHJlZUJlaGF2aW91ci5XYXRlckRlbHRhO1xyXG4gICAgYXBwLklzRGVhZCA9IHRyZWVCZWhhdmlvdXIuSGVhbHRoID09IDA7XHJcbiAgICBTYXZlVG9Mb2NhbFN0b3JhZ2UodHJlZUJlaGF2aW91ciwgY29uZmlnLCBmYWxzZSk7XHJcbn1cclxuXHJcbjtcblxyXG4gICAgICAgICAgICB3YXRlci5BZGRFdmVudExpc3RlbmVyKEV2ZW50VHlwZS5Mb2FkLCAoQWN0aW9uKSgoKSA9PlxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBVcGRhdGUoKTtcclxuICAgICAgICAgICAgICAgIGFwcC5SZWRyYXcoKTtcclxuICAgICAgICAgICAgfSkpO1xyXG5cclxuICAgICAgICAgICAgXHJcblxyXG4gICAgICAgICAgICBjYW52YXMuQWRkRXZlbnRMaXN0ZW5lcihFdmVudFR5cGUuQ2xpY2ssIChBY3Rpb248RXZlbnQ+KSgoZSkgPT5cclxuICAgICAgICAgICAge1xyXG5Nb3VzZUV2ZW50IG1lOyAgICAgICAgICAgICAgICBpZiAoISgobWUgPSBlIGFzIE1vdXNlRXZlbnQpICE9IG51bGwpKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBTY3JpcHQuV3JpdGUoXCJ2YXIgcmVjdCA9IGUudGFyZ2V0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1wiKTtcclxuICAgICAgICAgICAgICAgIFNjcmlwdC5Xcml0ZShcInZhciB4ID0gTWF0aC5mbG9vcihlLmNsaWVudFggLSByZWN0LmxlZnQpO1wiKTtcclxuICAgICAgICAgICAgICAgIFNjcmlwdC5Xcml0ZShcInZhciB5ID0gTWF0aC5mbG9vcihlLmNsaWVudFkgLSByZWN0LnRvcCk7XCIpO1xyXG4gICAgICAgICAgICAgICAgdmFyIHh4ID0gU2NyaXB0LkdldDxpbnQ+KFwieFwiKTtcclxuICAgICAgICAgICAgICAgIHZhciB5eSA9IFNjcmlwdC5HZXQ8aW50PihcInlcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHh4IDw9IDgwICYmIHl5ID49IDQzMClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodHJlZUJlaGF2aW91ci5IZWFsdGggPT0gMClcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFdpbmRvdy5Mb2NhbFN0b3JhZ2UuUmVtb3ZlSXRlbShjb25maWcuU2V0dGluZ1ByZWZpeCArIFwiLlNlZWRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyZWVCZWhhdmlvdXIgPSBMb2FkRnJvbUxvY2FsU3RvcmFnZShjb25maWcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhcHAuVXBkYXRlU2VlZCh0cmVlQmVoYXZpb3VyLlNlZWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0cmVlQmVoYXZpb3VyLldhdGVyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBVcGRhdGUoKTtcclxuICAgICAgICAgICAgICAgICAgICBhcHAuUmVkcmF3KCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pKTtcclxuXHJcbiAgICAgICAgICAgIHZhciByZWRyYXdUaW1lciA9IFdpbmRvdy5TZXRJbnRlcnZhbCgoQWN0aW9uKSgoKSA9PlxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBhcHAuUmVkcmF3KCk7XHJcbiAgICAgICAgICAgIH0pLCBjb25maWcuTXNSZWZyZXNoUmF0ZSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgdGlja1RpbWVyID0gV2luZG93LlNldEludGVydmFsKChBY3Rpb24pVXBkYXRlLCBjb25maWcuTXNUaWNrUmF0ZSk7XHJcblxyXG4gICAgICAgICAgICBVcGRhdGUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgc3RhdGljIHZvaWQgU2F2ZVRvTG9jYWxTdG9yYWdlKFRyZWVCZWhhdmlvdXJFbmdpbmUgdHJlZUJlaGF2aW91ciwgVHJlZUNvbmZpZ3VyYXRpb24gY29uZmlnLCBib29sIHNhdmVTZWVkKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIHNlZWRLZXkgPSBjb25maWcuU2V0dGluZ1ByZWZpeCArIFwiLlNlZWRcIjtcclxuICAgICAgICAgICAgdmFyIGhlYWx0aEtleSA9IGNvbmZpZy5TZXR0aW5nUHJlZml4ICsgXCIuSGVhbHRoXCI7XHJcbiAgICAgICAgICAgIHZhciB3YXRlckxldmVsS2V5ID0gY29uZmlnLlNldHRpbmdQcmVmaXggKyBcIi5XYXRlckxldmVsXCI7XHJcbiAgICAgICAgICAgIHZhciBncm93dGhLZXkgPSBjb25maWcuU2V0dGluZ1ByZWZpeCArIFwiLkdyb3d0aFwiO1xyXG4gICAgICAgICAgICB2YXIgdGlja0tleSA9IGNvbmZpZy5TZXR0aW5nUHJlZml4ICsgXCIuVGlja3NcIjtcclxuICAgICAgICAgICAgdmFyIHN0YXJ0S2V5ID0gY29uZmlnLlNldHRpbmdQcmVmaXggKyBcIi5TdGFydFwiO1xyXG4gICAgICAgICAgICB2YXIgbGFzdFVwZGF0ZUtleSA9IGNvbmZpZy5TZXR0aW5nUHJlZml4ICsgXCIuTGFzdFVwZGF0ZVwiO1xyXG5cclxuICAgICAgICAgICAgaWYgKHNhdmVTZWVkKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBXaW5kb3cuTG9jYWxTdG9yYWdlLlNldEl0ZW0oc2VlZEtleSwgdHJlZUJlaGF2aW91ci5TZWVkKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgV2luZG93LkxvY2FsU3RvcmFnZS5TZXRJdGVtKGhlYWx0aEtleSwgdHJlZUJlaGF2aW91ci5IZWFsdGgpO1xyXG4gICAgICAgICAgICBXaW5kb3cuTG9jYWxTdG9yYWdlLlNldEl0ZW0od2F0ZXJMZXZlbEtleSwgdHJlZUJlaGF2aW91ci5XYXRlckxldmVsKTtcclxuICAgICAgICAgICAgV2luZG93LkxvY2FsU3RvcmFnZS5TZXRJdGVtKGdyb3d0aEtleSwgdHJlZUJlaGF2aW91ci5Hcm93dGgpO1xyXG4gICAgICAgICAgICBXaW5kb3cuTG9jYWxTdG9yYWdlLlNldEl0ZW0odGlja0tleSwgdHJlZUJlaGF2aW91ci5UaWNrcyk7XHJcbiAgICAgICAgICAgIFdpbmRvdy5Mb2NhbFN0b3JhZ2UuU2V0SXRlbShzdGFydEtleSwgdHJlZUJlaGF2aW91ci5TdGFydCk7XHJcbiAgICAgICAgICAgIFdpbmRvdy5Mb2NhbFN0b3JhZ2UuU2V0SXRlbShsYXN0VXBkYXRlS2V5LCB0cmVlQmVoYXZpb3VyLkxhc3RVcGRhdGUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgVHJlZUJlaGF2aW91ckVuZ2luZSBMb2FkRnJvbUxvY2FsU3RvcmFnZShUcmVlQ29uZmlndXJhdGlvbiBjb25maWcpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgc2VlZEtleSA9IGNvbmZpZy5TZXR0aW5nUHJlZml4ICsgXCIuU2VlZFwiO1xyXG4gICAgICAgICAgICB2YXIgaGVhbHRoS2V5ID0gY29uZmlnLlNldHRpbmdQcmVmaXggKyBcIi5IZWFsdGhcIjtcclxuICAgICAgICAgICAgdmFyIHdhdGVyTGV2ZWxLZXkgPSBjb25maWcuU2V0dGluZ1ByZWZpeCArIFwiLldhdGVyTGV2ZWxcIjtcclxuICAgICAgICAgICAgdmFyIGdyb3d0aEtleSA9IGNvbmZpZy5TZXR0aW5nUHJlZml4ICsgXCIuR3Jvd3RoXCI7XHJcbiAgICAgICAgICAgIHZhciB0aWNrS2V5ID0gY29uZmlnLlNldHRpbmdQcmVmaXggKyBcIi5UaWNrc1wiO1xyXG4gICAgICAgICAgICB2YXIgc3RhcnRLZXkgPSBjb25maWcuU2V0dGluZ1ByZWZpeCArIFwiLlN0YXJ0XCI7XHJcbiAgICAgICAgICAgIHZhciBsYXN0VXBkYXRlS2V5ID0gY29uZmlnLlNldHRpbmdQcmVmaXggKyBcIi5MYXN0VXBkYXRlXCI7XHJcblxyXG4gICAgICAgICAgICB2YXIgaGVhbHRoVmFsdWUgPSBXaW5kb3cuTG9jYWxTdG9yYWdlLkdldEl0ZW0oaGVhbHRoS2V5KSBhcyBzdHJpbmc7XHJcbiAgICAgICAgICAgIHZhciBzZWVkVmFsdWUgPSBXaW5kb3cuTG9jYWxTdG9yYWdlLkdldEl0ZW0oc2VlZEtleSkgYXMgc3RyaW5nO1xyXG4gICAgICAgICAgICB2YXIgd2F0ZXJMZXZlbFZhbHVlID0gV2luZG93LkxvY2FsU3RvcmFnZS5HZXRJdGVtKHdhdGVyTGV2ZWxLZXkpIGFzIHN0cmluZztcclxuICAgICAgICAgICAgdmFyIGdyb3d0aFZhbHVlID0gV2luZG93LkxvY2FsU3RvcmFnZS5HZXRJdGVtKGdyb3d0aEtleSkgYXMgc3RyaW5nO1xyXG4gICAgICAgICAgICB2YXIgdGlja1ZhbHVlID0gV2luZG93LkxvY2FsU3RvcmFnZS5HZXRJdGVtKHRpY2tLZXkpIGFzIHN0cmluZztcclxuICAgICAgICAgICAgdmFyIHN0YXJ0VmFsdWUgPSBXaW5kb3cuTG9jYWxTdG9yYWdlLkdldEl0ZW0oc3RhcnRLZXkpIGFzIHN0cmluZztcclxuICAgICAgICAgICAgdmFyIGxhc3RVcGRhdGVWYWx1ZSA9IFdpbmRvdy5Mb2NhbFN0b3JhZ2UuR2V0SXRlbShsYXN0VXBkYXRlS2V5KSBhcyBzdHJpbmc7XHJcblxyXG4gICAgICAgICAgICB2YXIgcmVzZXRUcmVlID0gZmFsc2U7XHJcbmludCBzZWVkO1xuXHJcbiAgICAgICAgICAgIGlmICghaW50LlRyeVBhcnNlKHNlZWRWYWx1ZSwgb3V0IHNlZWQpKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBzZWVkID0gbmV3IFJhbmRvbSgpLk5leHQoKTtcclxuICAgICAgICAgICAgICAgIHJlc2V0VHJlZSA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuZG91YmxlIGhlYWx0aDtcblxyXG4gICAgICAgICAgICBpZiAoIWRvdWJsZS5UcnlQYXJzZShoZWFsdGhWYWx1ZSwgb3V0IGhlYWx0aCkgfHwgcmVzZXRUcmVlKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBoZWFsdGggPSAxO1xyXG4gICAgICAgICAgICB9XHJcbmRvdWJsZSB3YXRlckxldmVsO1xuXHJcbiAgICAgICAgICAgIGlmICghZG91YmxlLlRyeVBhcnNlKHdhdGVyTGV2ZWxWYWx1ZSwgb3V0IHdhdGVyTGV2ZWwpIHx8IHJlc2V0VHJlZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgd2F0ZXJMZXZlbCA9IGNvbmZpZy5Jbml0aWFsV2F0ZXJMZXZlbDtcclxuICAgICAgICAgICAgfVxyXG5kb3VibGUgZ3Jvd3RoO1xuXHJcbiAgICAgICAgICAgIGlmICghZG91YmxlLlRyeVBhcnNlKGdyb3d0aFZhbHVlLCBvdXQgZ3Jvd3RoKSB8fCByZXNldFRyZWUpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGdyb3d0aCA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuaW50IHRpY2s7XG5cclxuICAgICAgICAgICAgaWYgKCFpbnQuVHJ5UGFyc2UodGlja1ZhbHVlLCBvdXQgdGljaykgfHwgcmVzZXRUcmVlKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aWNrID0gMDtcclxuICAgICAgICAgICAgfVxyXG5kb3VibGUgc3RhcnQ7XG5cclxuICAgICAgICAgICAgaWYgKCFkb3VibGUuVHJ5UGFyc2Uoc3RhcnRWYWx1ZSwgb3V0IHN0YXJ0KSB8fCByZXNldFRyZWUpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHN0YXJ0ID0gRGF0ZS5Ob3coKTtcclxuICAgICAgICAgICAgfVxyXG5kb3VibGUgbGFzdFVwZGF0ZTtcblxyXG4gICAgICAgICAgICBpZiAoIWRvdWJsZS5UcnlQYXJzZShsYXN0VXBkYXRlVmFsdWUsIG91dCBsYXN0VXBkYXRlKSB8fCByZXNldFRyZWUpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGxhc3RVcGRhdGUgPSBEYXRlLk5vdygpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YXIgYmVoYXZpb3VyID0gbmV3IFRyZWVCZWhhdmlvdXJFbmdpbmUoY29uZmlnLCBzdGFydCwgbGFzdFVwZGF0ZSwgaGVhbHRoLCB3YXRlckxldmVsLCBncm93dGgsIHRpY2ssIHNlZWQpO1xyXG4gICAgICAgICAgICBTYXZlVG9Mb2NhbFN0b3JhZ2UoYmVoYXZpb3VyLCBjb25maWcsIHRydWUpO1xyXG4gICAgICAgICAgICByZXR1cm4gYmVoYXZpb3VyO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGNsYXNzIFRyZWVDb25maWd1cmF0aW9uc1xyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgVHJlZUNvbmZpZ3VyYXRpb24gUmVsZWFzZUNvbmZpZyB7IGdldDsgcHJpdmF0ZSBzZXQ7IH1cclxuICAgICAgICAgICAgXHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgVHJlZUNvbmZpZ3VyYXRpb24gRGVidWdDb25maWcgeyBnZXQ7IHByaXZhdGUgc2V0OyB9XHJcbiAgICAgICAgICAgIFxyXG5cclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBUcmVlQ29uZmlndXJhdGlvbiBMdWR1bURhcmU0NlRlc3QgeyBnZXQ7IHByaXZhdGUgc2V0OyB9XHJcbiAgICAgICAgICAgIFxyXG5cbiAgICBcbnByaXZhdGUgc3RhdGljIFRyZWVDb25maWd1cmF0aW9uIF9fUHJvcGVydHlfX0luaXRpYWxpemVyX19SZWxlYXNlQ29uZmlnPW5ldyBUcmVlQ29uZmlndXJhdGlvbkJ1aWxkZXIoKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBGdWxsR3Jvd25UcmVlID0gVGltZVNwYW4uRnJvbURheXMoMzY1ICogMiksIC8vIHR3byB5ZWFyc1xyXG4gICAgICAgICAgICAgICAgVGlja1JhdGUgPSBUaW1lU3Bhbi5Gcm9tTWludXRlcygxNSksXHJcbiAgICAgICAgICAgICAgICBXYXRlck1heCA9IFRpbWVTcGFuLkZyb21EYXlzKDE2KSxcclxuICAgICAgICAgICAgICAgIFdhdGVyTWluID0gVGltZVNwYW4uRnJvbURheXMoNSksXHJcbiAgICAgICAgICAgICAgICBTY3JlZW5SZWZyZXNoUmF0ZSA9IFRpbWVTcGFuLkZyb21NaW51dGVzKDEpLFxyXG4gICAgICAgICAgICAgICAgRHVyYXRpb25VbnRpbERlYWRXaGVuVW5oZWFsdGh5ID0gVGltZVNwYW4uRnJvbURheXMoMTQpLFxyXG4gICAgICAgICAgICAgICAgRHVyYXRpb25VbnRpbEZ1bGxIZWFsdGhXaGVuSGVhbHRoeSA9IFRpbWVTcGFuLkZyb21EYXlzKDE0KSxcclxuICAgICAgICAgICAgICAgIEluaXRpYWxXYXRlckxldmVsID0gMC4zLFxyXG4gICAgICAgICAgICAgICAgU2V0dGluZ1ByZWZpeCA9IFwiYm9uc2FpXCJcclxuICAgICAgICAgICAgfS5CdWlsZCgpO3ByaXZhdGUgc3RhdGljIFRyZWVDb25maWd1cmF0aW9uIF9fUHJvcGVydHlfX0luaXRpYWxpemVyX19EZWJ1Z0NvbmZpZz1uZXcgVHJlZUNvbmZpZ3VyYXRpb25CdWlsZGVyKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgRnVsbEdyb3duVHJlZSA9IFRpbWVTcGFuLkZyb21NaW51dGVzKDEpLFxyXG4gICAgICAgICAgICAgICAgVGlja1JhdGUgPSBUaW1lU3Bhbi5Gcm9tTWlsbGlzZWNvbmRzKDEwKSxcclxuICAgICAgICAgICAgICAgIFdhdGVyTWF4ID0gVGltZVNwYW4uRnJvbVNlY29uZHMoMTYpLFxyXG4gICAgICAgICAgICAgICAgV2F0ZXJNaW4gPSBUaW1lU3Bhbi5Gcm9tU2Vjb25kcyg1KSxcclxuICAgICAgICAgICAgICAgIFNjcmVlblJlZnJlc2hSYXRlID0gVGltZVNwYW4uRnJvbU1pbGxpc2Vjb25kcygxMDApLFxyXG4gICAgICAgICAgICAgICAgRHVyYXRpb25VbnRpbERlYWRXaGVuVW5oZWFsdGh5ID0gVGltZVNwYW4uRnJvbVNlY29uZHMoMTApLFxyXG4gICAgICAgICAgICAgICAgRHVyYXRpb25VbnRpbEZ1bGxIZWFsdGhXaGVuSGVhbHRoeSA9IFRpbWVTcGFuLkZyb21TZWNvbmRzKDEwKSxcclxuICAgICAgICAgICAgICAgIEluaXRpYWxXYXRlckxldmVsID0gMSxcclxuICAgICAgICAgICAgICAgIFNldHRpbmdQcmVmaXggPSBcImRlYnVnXCJcclxuICAgICAgICAgICAgfS5CdWlsZCgpO3ByaXZhdGUgc3RhdGljIFRyZWVDb25maWd1cmF0aW9uIF9fUHJvcGVydHlfX0luaXRpYWxpemVyX19MdWR1bURhcmU0NlRlc3Q9bmV3IFRyZWVDb25maWd1cmF0aW9uQnVpbGRlcigpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIEZ1bGxHcm93blRyZWUgPSBUaW1lU3Bhbi5Gcm9tSG91cnMoMiksXHJcbiAgICAgICAgICAgICAgICBUaWNrUmF0ZSA9IFRpbWVTcGFuLkZyb21NaWxsaXNlY29uZHMoMTAwKSxcclxuICAgICAgICAgICAgICAgIFNjcmVlblJlZnJlc2hSYXRlID0gVGltZVNwYW4uRnJvbU1pbGxpc2Vjb25kcygxMDAwKSxcclxuICAgICAgICAgICAgICAgIFdhdGVyTWF4ID0gVGltZVNwYW4uRnJvbU1pbnV0ZXMoMTUpLFxyXG4gICAgICAgICAgICAgICAgV2F0ZXJNaW4gPSBUaW1lU3Bhbi5Gcm9tTWludXRlcygzMCksXHJcbiAgICAgICAgICAgICAgICBEdXJhdGlvblVudGlsRGVhZFdoZW5VbmhlYWx0aHkgPSBUaW1lU3Bhbi5Gcm9tTWludXRlcygxNSksXHJcbiAgICAgICAgICAgICAgICBEdXJhdGlvblVudGlsRnVsbEhlYWx0aFdoZW5IZWFsdGh5ID0gVGltZVNwYW4uRnJvbU1pbnV0ZXMoMTUpLFxyXG4gICAgICAgICAgICAgICAgSW5pdGlhbFdhdGVyTGV2ZWwgPSAwLjMsXHJcbiAgICAgICAgICAgICAgICBTZXR0aW5nUHJlZml4ID0gXCJMRDQ2XCJcclxuICAgICAgICAgICAgfS5CdWlsZCgpO31cclxuXHJcbiAgICBwdWJsaWMgY2xhc3MgVHJlZUNvbmZpZ3VyYXRpb25CdWlsZGVyXHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIFRpbWVTcGFuIEZ1bGxHcm93blRyZWUgeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBUaW1lU3BhbiBUaWNrUmF0ZSB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIFRpbWVTcGFuIFdhdGVyTWluIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgVGltZVNwYW4gV2F0ZXJNYXggeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBUaW1lU3BhbiBEdXJhdGlvblVudGlsRGVhZFdoZW5VbmhlYWx0aHkgeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBUaW1lU3BhbiBEdXJhdGlvblVudGlsRnVsbEhlYWx0aFdoZW5IZWFsdGh5IHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgVGltZVNwYW4gU2NyZWVuUmVmcmVzaFJhdGUgeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBkb3VibGUgSW5pdGlhbFdhdGVyTGV2ZWwgeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBzdHJpbmcgU2V0dGluZ1ByZWZpeCB7IGdldDsgc2V0OyB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBUcmVlQ29uZmlndXJhdGlvbiBCdWlsZCgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFRyZWVDb25maWd1cmF0aW9uKFxyXG4gICAgICAgICAgICAgICAgR2V0UGVyVGlja1ZhbHVlKEZ1bGxHcm93blRyZWUpLFxyXG4gICAgICAgICAgICAgICAgR2V0UGVyVGlja1ZhbHVlKFdhdGVyTWluKSxcclxuICAgICAgICAgICAgICAgIEdldFBlclRpY2tWYWx1ZShXYXRlck1heCksXHJcbiAgICAgICAgICAgICAgICBHZXRQZXJUaWNrVmFsdWUoRHVyYXRpb25VbnRpbEZ1bGxIZWFsdGhXaGVuSGVhbHRoeSksXHJcbiAgICAgICAgICAgICAgICBHZXRQZXJUaWNrVmFsdWUoRHVyYXRpb25VbnRpbERlYWRXaGVuVW5oZWFsdGh5KSxcclxuICAgICAgICAgICAgICAgIEluaXRpYWxXYXRlckxldmVsLFxyXG4gICAgICAgICAgICAgICAgKGludClNYXRoLlJvdW5kKFNjcmVlblJlZnJlc2hSYXRlLlRvdGFsTWlsbGlzZWNvbmRzKSxcclxuICAgICAgICAgICAgICAgIChpbnQpTWF0aC5Sb3VuZChUaWNrUmF0ZS5Ub3RhbE1pbGxpc2Vjb25kcyksXHJcbiAgICAgICAgICAgICAgICBTZXR0aW5nUHJlZml4XHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIGRvdWJsZSBHZXRQZXJUaWNrVmFsdWUoVGltZVNwYW4gdmFsdWUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gMS4wIC8gKHZhbHVlLlRvdGFsTWlsbGlzZWNvbmRzIC8gVGlja1JhdGUuVG90YWxNaWxsaXNlY29uZHMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY2xhc3MgVHJlZUNvbmZpZ3VyYXRpb25cclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgVHJlZUNvbmZpZ3VyYXRpb24oXHJcbiAgICAgICAgICAgIGRvdWJsZSBtYXhHcm93dGhSYXRlLFxyXG4gICAgICAgICAgICBkb3VibGUgbWluV2F0ZXJSYXRlLFxyXG4gICAgICAgICAgICBkb3VibGUgbWF4V2F0ZXJSYXRlLFxyXG4gICAgICAgICAgICBkb3VibGUgaGVhbFJhdGUsXHJcbiAgICAgICAgICAgIGRvdWJsZSBoYXJtUmF0ZSxcclxuICAgICAgICAgICAgZG91YmxlIGluaXRpYWxXYXRlckxldmVsLFxyXG4gICAgICAgICAgICBpbnQgbXNSZWZyZXNoUmF0ZSxcclxuICAgICAgICAgICAgaW50IG1zVGlja1JhdGUsXHJcbiAgICAgICAgICAgIHN0cmluZyBzZXR0aW5nUHJlZml4XHJcbiAgICAgICAgKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgTWF4R3Jvd3RoUmF0ZSA9IG1heEdyb3d0aFJhdGU7XHJcbiAgICAgICAgICAgIE1pbldhdGVyUmF0ZSA9IG1pbldhdGVyUmF0ZTtcclxuICAgICAgICAgICAgTWF4V2F0ZXJSYXRlID0gbWF4V2F0ZXJSYXRlO1xyXG4gICAgICAgICAgICBIZWFsUmF0ZSA9IGhlYWxSYXRlO1xyXG4gICAgICAgICAgICBIYXJtUmF0ZSA9IGhhcm1SYXRlO1xyXG4gICAgICAgICAgICBJbml0aWFsV2F0ZXJMZXZlbCA9IGluaXRpYWxXYXRlckxldmVsO1xyXG4gICAgICAgICAgICBNc1JlZnJlc2hSYXRlID0gbXNSZWZyZXNoUmF0ZTtcclxuICAgICAgICAgICAgTXNUaWNrUmF0ZSA9IG1zVGlja1JhdGU7XHJcbiAgICAgICAgICAgIFNldHRpbmdQcmVmaXggPSBzZXR0aW5nUHJlZml4O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIGRvdWJsZSBNYXhHcm93dGhSYXRlIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgZG91YmxlIE1pbldhdGVyUmF0ZSB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIGRvdWJsZSBNYXhXYXRlclJhdGUgeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBkb3VibGUgSGVhbFJhdGUgeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBkb3VibGUgSGFybVJhdGUgeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBkb3VibGUgSW5pdGlhbFdhdGVyTGV2ZWwgeyBnZXQ7IHByaXZhdGUgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIGludCBNc1JlZnJlc2hSYXRlIHsgZ2V0OyBwcml2YXRlIHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBpbnQgTXNUaWNrUmF0ZSB7IGdldDsgcHJpdmF0ZSBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgc3RyaW5nIFNldHRpbmdQcmVmaXggeyBnZXQ7IHByaXZhdGUgc2V0OyB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNsYXNzIFRyZWVCZWhhdmlvdXJFbmdpbmVcclxuICAgIHtcclxuICAgICAgICBwcml2YXRlIHJlYWRvbmx5IFJhbmRvbVdyYXBwZXIgcm5kU291cmNlO1xyXG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgVHJlZUNvbmZpZ3VyYXRpb24gY29uZmlnO1xyXG5cclxuICAgICAgICBwdWJsaWMgVHJlZUJlaGF2aW91ckVuZ2luZShUcmVlQ29uZmlndXJhdGlvbiBjb25maWcsIGRvdWJsZSBzdGFydCwgZG91YmxlIGxhc3RVcGRhdGUsIGRvdWJsZSBoZWFsdGgsIGRvdWJsZSB3YXRlckxldmVsLCBkb3VibGUgZ3Jvd3RoLCBpbnQgdGlja3MsIGludCBzZWVkKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5jb25maWcgPSBjb25maWc7XHJcbiAgICAgICAgICAgIFN0YXJ0ID0gc3RhcnQ7XHJcbiAgICAgICAgICAgIExhc3RVcGRhdGUgPSBsYXN0VXBkYXRlO1xyXG4gICAgICAgICAgICBIZWFsdGggPSBoZWFsdGg7XHJcbiAgICAgICAgICAgIEdyb3d0aCA9IGdyb3d0aDtcclxuICAgICAgICAgICAgVGlja3MgPSB0aWNrcztcclxuICAgICAgICAgICAgU2VlZCA9IHNlZWQ7XHJcbiAgICAgICAgICAgIFdhdGVyTGV2ZWwgPSB3YXRlckxldmVsO1xyXG4gICAgICAgICAgICBXYXRlckRlbHRhID0gMC4xMjU7XHJcblxyXG4gICAgICAgICAgICBybmRTb3VyY2UgPSBuZXcgUmFuZG9tV3JhcHBlcihzZWVkKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBkb3VibGUgV2F0ZXJEZWx0YSB7IGdldDsgcHJpdmF0ZSBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgZG91YmxlIFdhdGVyTGV2ZWwgeyBnZXQ7IHByaXZhdGUgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIGRvdWJsZSBTdGFydCB7IGdldDsgcHJpdmF0ZSBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgZG91YmxlIExhc3RVcGRhdGUgeyBnZXQ7IHByaXZhdGUgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIGRvdWJsZSBIZWFsdGggeyBnZXQ7IHByaXZhdGUgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIGRvdWJsZSBHcm93dGggeyBnZXQ7IHByaXZhdGUgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIGludCBUaWNrcyB7IGdldDsgcHJpdmF0ZSBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgaW50IFNlZWQgeyBnZXQ7IHByaXZhdGUgc2V0OyB9XHJcbnByaXZhdGUgYm9vbCBJc0hlYWx0aHlcclxue1xyXG4gICAgZ2V0XHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIFdhdGVyTGV2ZWwgPiAwLjAwMSAmJiBXYXRlckxldmVsIDw9IDE7XHJcbiAgICB9XHJcbn1cclxuICAgICAgICBwdWJsaWMgdm9pZCBXYXRlcigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBXYXRlckxldmVsICs9IFdhdGVyRGVsdGE7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBVcGRhdGUoZG91YmxlIG5vdylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciB0YXJnZXRUaWNrcyA9IChpbnQpKChub3cgLSBTdGFydCkgLyBjb25maWcuTXNUaWNrUmF0ZSk7XHJcbiAgICAgICAgICAgIHZhciBkZWx0YSA9IHRhcmdldFRpY2tzIC0gVGlja3M7XHJcblxyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRlbHRhOyBpKyspXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIFRpY2soKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgTGFzdFVwZGF0ZSA9IG5vdztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgdm9pZCBUaWNrKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFRpY2tzKys7XHJcblxyXG4gICAgICAgICAgICBHcm93dGhUaWNrKCk7XHJcbiAgICAgICAgICAgIFdhdGVyVGljaygpO1xyXG4gICAgICAgICAgICBIZWFsdGhUaWNrKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHZvaWQgR3Jvd3RoVGljaygpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAoR3Jvd3RoID49IDEpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIEdyb3d0aCA9IDE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBHcm93dGggKz0gY29uZmlnLk1heEdyb3d0aFJhdGUgKiBIZWFsdGg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgdm9pZCBXYXRlclRpY2soKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIHdEZWx0YSA9IGNvbmZpZy5NYXhXYXRlclJhdGUgLSBjb25maWcuTWluV2F0ZXJSYXRlO1xyXG4gICAgICAgICAgICB2YXIgd2F0ZXJBbW91bnQgPSBybmRTb3VyY2UuTmV4dERvdWJsZSgpICogd0RlbHRhICsgY29uZmlnLk1pbldhdGVyUmF0ZTtcclxuICAgICAgICAgICAgV2F0ZXJMZXZlbCAtPSB3YXRlckFtb3VudDtcclxuXHJcbiAgICAgICAgICAgIGlmIChXYXRlckxldmVsIDwgMClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgV2F0ZXJMZXZlbCA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgdm9pZCBIZWFsdGhUaWNrKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmIChIZWFsdGggPD0gMClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgSGVhbHRoID0gMDtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKElzSGVhbHRoeSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgSGVhbHRoICs9IGNvbmZpZy5IZWFsUmF0ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIEhlYWx0aCAtPSBjb25maWcuSGFybVJhdGU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChIZWFsdGggPCAwKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBIZWFsdGggPSAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKEhlYWx0aCA+IDEpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIEhlYWx0aCA9IDE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcclxuXHJcbm5hbWVzcGFjZSBXaXNjaGkuTEQ0Ni5LZWVwSXRBbGl2ZVxyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgUmFuZG9tV3JhcHBlciA6IElSYW5kb21Tb3VyY2VcclxuICAgIHtcclxuICAgICAgICBwcml2YXRlIFJhbmRvbSByYW5kb207XHJcbiAgICAgICAgcHJpdmF0ZSByZWFkb25seSBpbnQgc2VlZDtcclxuXHJcbiAgICAgICAgcHVibGljIFJhbmRvbVdyYXBwZXIoaW50IHNlZWQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLnNlZWQgPSBzZWVkO1xyXG4gICAgICAgICAgICBSZXNldCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgUmVzZXQoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmFuZG9tID0gbmV3IFJhbmRvbShzZWVkKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBkb3VibGUgTmV4dERvdWJsZSgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gcmFuZG9tLk5leHREb3VibGUoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGludGVyZmFjZSBJUmFuZG9tU291cmNlXHJcbiAgICB7XHJcbiAgICAgICAgZG91YmxlIE5leHREb3VibGUoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY2xhc3MgVHJlZUJ1aWxkZXJcclxuICAgIHtcclxuICAgICAgICBwcml2YXRlIGNvbnN0IGRvdWJsZSBUQVUgPSA2LjI4MzE4NTMwNzE3OTU4NjI7XHJcblxyXG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgSVJhbmRvbVNvdXJjZSByYW5kb207XHJcblxyXG4gICAgICAgIHB1YmxpYyBUcmVlQnVpbGRlcihJUmFuZG9tU291cmNlIHJhbmRvbSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMucmFuZG9tID0gcmFuZG9tID8/ICgoU3lzdGVtLkZ1bmM8SVJhbmRvbVNvdXJjZT4pKCgpPT57dGhyb3cgbmV3IEFyZ3VtZW50TnVsbEV4Y2VwdGlvbihcInJhbmRvbVwiKTt9KSkoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBkb3VibGUgVHJ1bmtUaGlja25lc3MgeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBkb3VibGUgUHJvYmFiaWxpdHlTaW5nbGVCcmFuY2ggeyBnZXQ7IHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBkb3VibGUgQnJhbmNoVGhpY2tuZXNzUmVkdWN0aW9uRmFjdG9yIHsgZ2V0OyBzZXQ7IH1cclxuICAgICAgICBwdWJsaWMgZG91YmxlIEJyYW5jaExlbmd0aFJlZHVjdGlvbkZhY3Rvck1pbiB7IGdldDsgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIGRvdWJsZSBCcmFuY2hMZW5ndGhSZWR1Y3Rpb25GYWN0b3JNYXggeyBnZXQ7IHNldDsgfVxyXG5cclxuICAgICAgICBwdWJsaWMgZG91YmxlIE1heFJvdGF0aW9uRmFjdG9yIHsgZ2V0OyBzZXQ7IH0gXHJcbiAgICAgICAgcHVibGljIGRvdWJsZSBCcmFuY2hTcHJlYWRNaW4geyBnZXQ7IHNldDsgfSBcclxuICAgICAgICBwdWJsaWMgZG91YmxlIEJyYW5jaFNwcmVhZE1heCB7IGdldDsgc2V0OyB9IFxyXG5cclxuXHJcbiAgICAgICAgcHVibGljIGludCBNYXhEZXB0aCB7IGdldDsgc2V0OyB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBUcmVlU2VnbWVudCBCdWlsZFRyZWUoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIHRydW5rID0gbmV3IFRyZWVTZWdtZW50KFRydW5rVGhpY2tuZXNzKTtcclxuICAgICAgICAgICAgQWRkQnJhbmNoZXNUb1NlZ21lbnQodHJ1bmssIDAuMjUgKiBUQVUpO1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1bms7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHZvaWQgQWRkQnJhbmNoZXNUb1NlZ21lbnQoVHJlZVNlZ21lbnQgc2VnbWVudCwgZG91YmxlIGFic29sdXRlQW5nbGUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAoc2VnbWVudC5EZXB0aCA9PSBNYXhEZXB0aClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoc2VnbWVudC5UaGlja25lc3MgPCAwLjAwMilcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb25zdCBkb3VibGUgbWF4RGV2QW5nbGUgPSAwLjEgKiBUQVU7XHJcbiAgICAgICAgICAgIGNvbnN0IGRvdWJsZSBncmF2aXR5Tm9ybWFsID0gMC43NSAqIFRBVTtcclxuXHJcbiAgICAgICAgICAgIHZhciBmbG9hdERlcHRoID0gKGRvdWJsZSlzZWdtZW50LkRlcHRoIC8gTWF4RGVwdGg7XHJcbiAgICAgICAgICAgIHZhciBkZWx0YUFuZ2xlID0gTWF0aC5BdGFuMihNYXRoLlNpbihncmF2aXR5Tm9ybWFsIC0gYWJzb2x1dGVBbmdsZSksIE1hdGguQ29zKGdyYXZpdHlOb3JtYWwgLSBhYnNvbHV0ZUFuZ2xlKSk7XHJcblxyXG4gICAgICAgICAgICBpZiAoTWF0aC5BYnMoZGVsdGFBbmdsZSkgPCBtYXhEZXZBbmdsZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YXIgcmFuZG9tRGV2aWF0aW9uQW5nbGUgPSByYW5kb20uTmV4dERvdWJsZSgpICogMiAqIE1heFJvdGF0aW9uRmFjdG9yIC0gTWF4Um90YXRpb25GYWN0b3I7XHJcbiAgICAgICAgICAgIHZhciBkZXZpYXRpb25BbmdsZSA9IEJpYXNlZFZhbHVlKDAsIHJhbmRvbURldmlhdGlvbkFuZ2xlLCAxKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBicmFuY2hpbmdTcHJlYWQgPSByYW5kb20uVW5pZm9ybVJhbmRvbShCcmFuY2hTcHJlYWRNaW4sIEJyYW5jaFNwcmVhZE1heCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoc2VnbWVudC5EZXB0aCA9PSAwKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBBZGRBbmdsZWRCcmFuY2goc2VnbWVudCwgZGV2aWF0aW9uQW5nbGUgLSBicmFuY2hpbmdTcHJlYWQgLyAyLCBhYnNvbHV0ZUFuZ2xlKTtcclxuICAgICAgICAgICAgICAgIEFkZEFuZ2xlZEJyYW5jaChzZWdtZW50LCBkZXZpYXRpb25BbmdsZSArIGJyYW5jaGluZ1NwcmVhZCAvIDIsIGFic29sdXRlQW5nbGUpO1xyXG4gICAgICAgICAgICAgICAgQWRkQW5nbGVkQnJhbmNoKHNlZ21lbnQsIGRldmlhdGlvbkFuZ2xlLCBhYnNvbHV0ZUFuZ2xlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChyYW5kb20uTmV4dERvdWJsZSgpIDw9IFByb2JhYmlsaXR5U2luZ2xlQnJhbmNoKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAvLyBubyBicmFuY2hpbmdcclxuICAgICAgICAgICAgICAgIEFkZEFuZ2xlZEJyYW5jaChzZWdtZW50LCBkZXZpYXRpb25BbmdsZSwgYWJzb2x1dGVBbmdsZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAvLyBicmFuY2hpbmdcclxuICAgICAgICAgICAgICAgIHZhciBsZWZ0QW5nbGUgPSBkZXZpYXRpb25BbmdsZSAtIGJyYW5jaGluZ1NwcmVhZCAvIDI7XHJcbiAgICAgICAgICAgICAgICB2YXIgcmlnaHRBbmdsZSA9IGRldmlhdGlvbkFuZ2xlICsgYnJhbmNoaW5nU3ByZWFkIC8gMjtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAocmFuZG9tLk5leHREb3VibGUoKSA8IDAuOClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcm5kQW5nbGUgPSByYW5kb20uVW5pZm9ybVJhbmRvbShkZXZpYXRpb25BbmdsZSAtIGJyYW5jaGluZ1NwcmVhZCwgZGV2aWF0aW9uQW5nbGUgKyBicmFuY2hpbmdTcHJlYWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB0aGlja25lc3MgPSByYW5kb20uVW5pZm9ybVJhbmRvbSgwLjI1LCAwLjUpO1xyXG4gICAgICAgICAgICAgICAgICAgIEFkZEFuZ2xlZEJyYW5jaChzZWdtZW50LCBybmRBbmdsZSwgYWJzb2x1dGVBbmdsZSwgZXh0cmFUaGlja25lc3NGYWN0b3I6IHRoaWNrbmVzcyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgQWRkQW5nbGVkQnJhbmNoKHNlZ21lbnQsIGxlZnRBbmdsZSwgYWJzb2x1dGVBbmdsZSk7XHJcbiAgICAgICAgICAgICAgICBBZGRBbmdsZWRCcmFuY2goc2VnbWVudCwgcmlnaHRBbmdsZSwgYWJzb2x1dGVBbmdsZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgZG91YmxlIEJpYXNlZFZhbHVlKGRvdWJsZSB2YWx1ZUEsIGRvdWJsZSB2YWx1ZUIsIGRvdWJsZSBiaWFzKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuIHZhbHVlQiAqIGJpYXMgKyB2YWx1ZUEgKiAoMSAtIGJpYXMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSB2b2lkIEFkZEFuZ2xlZEJyYW5jaChUcmVlU2VnbWVudCBwYXJlbnQsIGRvdWJsZSBkZXZpYXRpb24sIGRvdWJsZSBvbGRBYnNvbHV0ZUFuZ2xlLCBkb3VibGUgZXh0cmFUaGlja25lc3NGYWN0b3IgPSAxKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIGZsb2F0RGVwdGggPSAoZG91YmxlKXBhcmVudC5EZXB0aCAvIE1heERlcHRoO1xyXG5cclxuICAgICAgICAgICAgdmFyIGxlbmd0aEZhY3RvciA9IDAuODtcclxuXHJcbiAgICAgICAgICAgIGlmIChwYXJlbnQuRGVwdGggPCAzKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBsZW5ndGhGYWN0b3IgPSByYW5kb20uVW5pZm9ybVJhbmRvbShCcmFuY2hMZW5ndGhSZWR1Y3Rpb25GYWN0b3JNaW4sIEJyYW5jaExlbmd0aFJlZHVjdGlvbkZhY3Rvck1heCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciBuZXh0VGhpbmNrbmVzcyA9IHBhcmVudC5UaGlja25lc3MgKiBCcmFuY2hUaGlja25lc3NSZWR1Y3Rpb25GYWN0b3IgKiBleHRyYVRoaWNrbmVzc0ZhY3RvcjtcclxuXHJcbiAgICAgICAgICAgIHZhciBicmFuY2ggPSBwYXJlbnQuQWRkQnJhbmNoKGRldmlhdGlvbiwgcGFyZW50Lkxlbmd0aCAqIGxlbmd0aEZhY3RvciwgbmV4dFRoaW5ja25lc3MpO1xyXG4gICAgICAgICAgICBBZGRCcmFuY2hlc1RvU2VnbWVudChicmFuY2gsIG9sZEFic29sdXRlQW5nbGUgKyBkZXZpYXRpb24pO1xyXG4gICAgICAgIH1cclxuXG4gICAgXG5wcml2YXRlIGRvdWJsZSBfX1Byb3BlcnR5X19Jbml0aWFsaXplcl9fVHJ1bmtUaGlja25lc3M9MC4zO3ByaXZhdGUgZG91YmxlIF9fUHJvcGVydHlfX0luaXRpYWxpemVyX19Qcm9iYWJpbGl0eVNpbmdsZUJyYW5jaD0wLjE7cHJpdmF0ZSBkb3VibGUgX19Qcm9wZXJ0eV9fSW5pdGlhbGl6ZXJfX0JyYW5jaFRoaWNrbmVzc1JlZHVjdGlvbkZhY3Rvcj0wLjc7cHJpdmF0ZSBkb3VibGUgX19Qcm9wZXJ0eV9fSW5pdGlhbGl6ZXJfX0JyYW5jaExlbmd0aFJlZHVjdGlvbkZhY3Rvck1pbj0wLjY7cHJpdmF0ZSBkb3VibGUgX19Qcm9wZXJ0eV9fSW5pdGlhbGl6ZXJfX0JyYW5jaExlbmd0aFJlZHVjdGlvbkZhY3Rvck1heD0wLjg1O3ByaXZhdGUgZG91YmxlIF9fUHJvcGVydHlfX0luaXRpYWxpemVyX19NYXhSb3RhdGlvbkZhY3Rvcj0wLjMxNDE1OTI2NTM1ODk3OTMxO3ByaXZhdGUgZG91YmxlIF9fUHJvcGVydHlfX0luaXRpYWxpemVyX19CcmFuY2hTcHJlYWRNaW49MC42MjgzMTg1MzA3MTc5NTg2Mjtwcml2YXRlIGRvdWJsZSBfX1Byb3BlcnR5X19Jbml0aWFsaXplcl9fQnJhbmNoU3ByZWFkTWF4PTEuMjU2NjM3MDYxNDM1OTE3Mztwcml2YXRlIGludCBfX1Byb3BlcnR5X19Jbml0aWFsaXplcl9fTWF4RGVwdGg9MTI7fVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgY2xhc3MgUmFuZG9tRXh0ZW5zaW9uc1xyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZG91YmxlIFVuaWZvcm1SYW5kb20odGhpcyBJUmFuZG9tU291cmNlIHJhbmRvbVNvdXJjZSwgZG91YmxlIGxvd2VyTGltaXQsIGRvdWJsZSB1cHBlckxpbWl0KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIGRlbHRhID0gKHVwcGVyTGltaXQgLSBsb3dlckxpbWl0KTtcclxuICAgICAgICAgICAgdmFyIHJhbmRBbW91bnQgPSByYW5kb21Tb3VyY2UuTmV4dERvdWJsZSgpICogZGVsdGE7XHJcbiAgICAgICAgICAgIHJldHVybiBsb3dlckxpbWl0ICsgcmFuZEFtb3VudDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGludGVyZmFjZSBJUGl4ZWxTY3JlZW5Xcml0ZXJcclxuICAgIHtcclxuICAgICAgICB2b2lkIFNldFBpeGVsKGludCB4LCBpbnQgeSwgYm9vbCBzZXQpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdHJ1Y3QgVmVjdG9yMmRcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgVmVjdG9yMmQoZG91YmxlIHgsIGRvdWJsZSB5KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgWCA9IHg7XHJcbiAgICAgICAgICAgIFkgPSB5O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIGRvdWJsZSBYIHsgZ2V0OyBwcml2YXRlIHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBkb3VibGUgWSB7IGdldDsgcHJpdmF0ZSBzZXQ7IH1cclxucHVibGljIGRvdWJsZSBMZW5ndGhcclxue1xyXG4gICAgZ2V0XHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguU3FydChYICogWCArIFkgKiBZKTtcclxuICAgIH1cclxufVxyXG4gICAgICAgIHB1YmxpYyBWZWN0b3IyZCBSb3RhdGUoZG91YmxlIHJhZGlhbkFuZ2xlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIGNvc0FuZ2xlID0gTWF0aC5Db3MocmFkaWFuQW5nbGUpO1xyXG4gICAgICAgICAgICB2YXIgc2luQW5nbGUgPSBNYXRoLlNpbihyYWRpYW5BbmdsZSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgeCA9IGNvc0FuZ2xlICogWCAtIHNpbkFuZ2xlICogWTtcclxuICAgICAgICAgICAgdmFyIHkgPSBzaW5BbmdsZSAqIFggKyBjb3NBbmdsZSAqIFk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjJkKHgsIHkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIFZlY3RvcjJkIENoYW5nZUxlbmd0aChkb3VibGUgbmV3TGVuZ3RoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIGxlbiA9IExlbmd0aDtcclxuXHJcbiAgICAgICAgICAgIHZhciBub3JtYWxpemVkWCA9IFggLyBsZW47XHJcbiAgICAgICAgICAgIHZhciBub3JtYWxpemVkWSA9IFkgLyBsZW47XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjJkKG5vcm1hbGl6ZWRYICogbmV3TGVuZ3RoLCBub3JtYWxpemVkWSAqIG5ld0xlbmd0aCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjbGFzcyBUcmVlU2VnbWVudFxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBUcmVlU2VnbWVudChkb3VibGUgdGhpY2tuZXNzKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgRGVwdGggPSAwO1xyXG4gICAgICAgICAgICBEZXZpYXRpb25BbmdsZSA9IDA7XHJcbiAgICAgICAgICAgIExlbmd0aCA9IDE7XHJcblxyXG4gICAgICAgICAgICBCcmFuY2hlcyA9IG5ldyBMaXN0PFRyZWVTZWdtZW50PigpO1xyXG4gICAgICAgICAgICBUaGlja25lc3MgPSB0aGlja25lc3M7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIFRyZWVTZWdtZW50KGludCBkZXB0aCwgZG91YmxlIGRldmlhdGlvbkFuZ2xlLCBkb3VibGUgbGVuZ3RoLCBkb3VibGUgdGhpY2tuZXNzKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgRGVwdGggPSBkZXB0aDtcclxuICAgICAgICAgICAgRGV2aWF0aW9uQW5nbGUgPSBkZXZpYXRpb25BbmdsZTtcclxuICAgICAgICAgICAgTGVuZ3RoID0gbGVuZ3RoO1xyXG4gICAgICAgICAgICBUaGlja25lc3MgPSB0aGlja25lc3M7XHJcbiAgICAgICAgICAgIEJyYW5jaGVzID0gbmV3IExpc3Q8VHJlZVNlZ21lbnQ+KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgaW50IERlcHRoIHsgZ2V0OyBwcml2YXRlIHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBkb3VibGUgVGhpY2tuZXNzIHsgZ2V0OyBwcml2YXRlIHNldDsgfVxyXG4gICAgICAgIHB1YmxpYyBkb3VibGUgRGV2aWF0aW9uQW5nbGUgeyBnZXQ7IHByaXZhdGUgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIGRvdWJsZSBMZW5ndGggeyBnZXQ7IHByaXZhdGUgc2V0OyB9XHJcbiAgICAgICAgcHVibGljIElMaXN0PFRyZWVTZWdtZW50PiBCcmFuY2hlcyB7IGdldDsgcHJpdmF0ZSBzZXQ7IH1cclxuXHJcbiAgICAgICAgcHVibGljIFRyZWVTZWdtZW50IEFkZEJyYW5jaChkb3VibGUgZGV2aWF0aW9uQW5nbGUsIGRvdWJsZSBsZW5ndGgsIGRvdWJsZSB0aGlja25lc3MpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgYnJhbmNoID0gbmV3IFRyZWVTZWdtZW50KERlcHRoICsgMSwgZGV2aWF0aW9uQW5nbGUsIGxlbmd0aCwgdGhpY2tuZXNzKTtcclxuICAgICAgICAgICAgQnJhbmNoZXMuQWRkKGJyYW5jaCk7XHJcbiAgICAgICAgICAgIHJldHVybiBicmFuY2g7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiJdCn0K
