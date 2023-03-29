/**
 * @compiler H5 23.2.35853
 */
H5.assemblyVersion("Wischi.LD46.KeepItAlive.WebH5","1.0.0.0");
H5.assembly("Wischi.LD46.KeepItAlive.WebH5", function ($asm, globals) {
    "use strict";

    H5.define("Wischi.LD46.KeepItAlive.BridgeNet.IClock", {
        $kind: "interface"
    });

    H5.define("Wischi.LD46.KeepItAlive.BridgeNet.EasingHelper", {
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

    H5.define("Wischi.LD46.KeepItAlive.BridgeNet.ITreeStateStore", {
        $kind: "interface"
    });

    H5.define("Wischi.LD46.KeepItAlive.BridgeNet.LoadingDrawer", {
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

    H5.define("Wischi.LD46.KeepItAlive.BridgeNet.SharedDrawingState", {
        fields: {
            GrowthControl: 0,
            WaterAmount: 0,
            ThicknessControl: 0,
            WaterDelta: 0,
            IsDead: false,
            Seed: 0
        }
    });

    H5.define("Wischi.LD46.KeepItAlive.BridgeNet.TreeAppContext", {
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
            Initialize: function () {
                var state = this.treeStateStore.Get();

                if (state == null) {
                    state = this.treeStateFactory.CreateTree();
                    this.treeStateStore.Set(state);
                }

                this.TreeBehaviour = new Wischi.LD46.KeepItAlive.BridgeNet.TreeBehaviourEngine(this.config, state);
            },
            ResetTree: function () {
                var state = this.treeStateFactory.CreateTree();
                this.treeStateStore.Set(state);
                this.TreeBehaviour = new Wischi.LD46.KeepItAlive.BridgeNet.TreeBehaviourEngine(this.config, state);
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
            Water: function () {
                this.TreeBehaviour.Water();
                this.treeStateStore.Set(this.TreeBehaviour.TreeState);
            },
            AutoSave: function () {
                this.treeStateStore.Set(this.TreeBehaviour.TreeState);
            }
        }
    });

    H5.define("Wischi.LD46.KeepItAlive.BridgeNet.TreeBehaviourEngine", {
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
                var targetTicks = H5.Int.clip32((now - this.TreeState.StartTimestamp) / this.config.MsTickRate);
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

    H5.define("Wischi.LD46.KeepItAlive.BridgeNet.TreeDrawer", {
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

                canvas.setAttribute("width", H5.toString(Wischi.LD46.KeepItAlive.BridgeNet.TreeDrawer.CanvasWidth));
                canvas.setAttribute("height", H5.toString(Wischi.LD46.KeepItAlive.BridgeNet.TreeDrawer.CanvasHeight));

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
                    this.ctx.fillRect(((0 + marginLeft) | 0), ((((((Wischi.LD46.KeepItAlive.BridgeNet.TreeDrawer.CanvasHeight - marginBottom) | 0) - H5.Int.mul(2, padding)) | 0) - height) | 0), ((((Wischi.LD46.KeepItAlive.BridgeNet.TreeDrawer.CanvasWidth - margin) | 0) - marginLeft) | 0), ((height + H5.Int.mul(2, padding)) | 0));

                    this.ctx.fillStyle = "#0077BE80";
                    this.ctx.fillRect(((((0 + marginLeft) | 0) + padding) | 0), ((((((Wischi.LD46.KeepItAlive.BridgeNet.TreeDrawer.CanvasHeight - marginBottom) | 0) - padding) | 0) - height) | 0), H5.Int.mul((((((((Wischi.LD46.KeepItAlive.BridgeNet.TreeDrawer.CanvasWidth - H5.Int.mul(2, padding)) | 0) - margin) | 0) - marginLeft) | 0)), waterPredition), height);

                    this.ctx.fillStyle = "#0077BE";
                    this.ctx.fillRect(((((0 + marginLeft) | 0) + padding) | 0), ((((((Wischi.LD46.KeepItAlive.BridgeNet.TreeDrawer.CanvasHeight - marginBottom) | 0) - padding) | 0) - height) | 0), H5.Int.clip32((((((((Wischi.LD46.KeepItAlive.BridgeNet.TreeDrawer.CanvasWidth - H5.Int.mul(2, padding)) | 0) - margin) | 0) - marginLeft) | 0)) * this.sharedDrawingState.WaterAmount), height);
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

    H5.define("Wischi.LD46.KeepItAlive.BridgeNet.TreeDrawingContext", {
        statics: {
            fields: {
                TAU: 0
            },
            ctors: {
                init: function () {
                    this.TAU = 6.283185307179586;
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

                var lowerDepth = H5.Int.clip32(floatingDepth);
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
                H5.Deconstruct(this.DrawSegmentToCanvas2(x.v, y.v, internalThickness, currentBranchAbsoluteAngle, lastThickness, lastBranchAbsoluteAngle, length).$clone(), x, y);

                $t = H5.getEnumerator(currentSegment.Branches, Wischi.LD46.KeepItAlive.TreeSegment);
                try {
                    while ($t.moveNext()) {
                        var branch = $t.Current;
                        this.DrawSegmentInternal(branch, x.v, y.v, currentBranchAbsoluteAngle, internalThickness);
                    }
                } finally {
                    if (H5.is($t, System.IDisposable)) {
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

    H5.define("Wischi.LD46.KeepItAlive.BridgeNet.TreeEnvironmentConfig", {
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

    H5.define("Wischi.LD46.KeepItAlive.BridgeNet.TreeEnvironmentConfigBuilder", {
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
                return new Wischi.LD46.KeepItAlive.BridgeNet.TreeEnvironmentConfig(this.GetPerTickValue(this.FullGrownTree), this.GetPerTickValue(this.WaterMin), this.GetPerTickValue(this.WaterMax), this.GetPerTickValue(this.DurationUntilFullHealthWhenHealthy), this.GetPerTickValue(this.DurationUntilDeadWhenUnhealthy), this.InitialWaterLevel, H5.Int.clip32(H5.Math.round(this.ScreenRefreshRate.getTotalMilliseconds(), 0, 6)), H5.Int.clip32(H5.Math.round(this.TickRate.getTotalMilliseconds(), 0, 6)), 15000, this.SettingPrefix);
            },
            GetPerTickValue: function (value) {
                return 1.0 / (value.getTotalMilliseconds() / this.TickRate.getTotalMilliseconds());
            }
        }
    });

    H5.define("Wischi.LD46.KeepItAlive.BridgeNet.TreeEnvironmentConfigs", {
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

    H5.define("Wischi.LD46.KeepItAlive.BridgeNet.TreeState", {
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

    H5.define("Wischi.LD46.KeepItAlive.BridgeNet.TreeStateFactory", {
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

    H5.define("Wischi.LD46.KeepItAlive.BridgeNet.TreeStateStore", {
        fields: {
            treeStateKey: null,
            tokenKey: null
        },
        events: {
            SyncTokenChanged: null
        },
        props: {
            SyncToken: {
                get: function () {
                    return window.localStorage.getItem(this.tokenKey);
                },
                set: function (value) {
                    window.localStorage.setItem(this.tokenKey, value);
                    !H5.staticEquals(this.SyncTokenChanged, null) ? this.SyncTokenChanged(this, { }) : null;
                }
            }
        },
        ctors: {
            ctor: function (prefix) {
                this.$initialize();
                this.treeStateKey = (prefix || "") + ".TreeStateV1";
                this.tokenKey = (prefix || "") + ".Token";
            }
        },
        methods: {
            Get: function () {
                return this.LoadFromLocalStorage();
            },
            Set: function (treeState) {
                this.SaveToLocalStorage(treeState);
            },
            SaveToLocalStorage: function (treeState) {
                if (treeState == null) {
                    window.localStorage.removeItem(this.treeStateKey);
                    return;
                }

                var treeJson = JSON.stringify(treeState);
                window.localStorage.setItem(this.treeStateKey, treeJson);
            },
            LoadFromLocalStorage: function () {
                var treeJson = window.localStorage.getItem(this.treeStateKey);

                if (System.String.isNullOrWhiteSpace(treeJson)) {
                    return null;
                }

                return H5.unbox(JSON.parse(treeJson));
            }
        }
    });

    H5.define("Wischi.LD46.KeepItAlive.IRandomSource", {
        $kind: "interface"
    });

    H5.define("Wischi.LD46.KeepItAlive.RandomExtensions", {
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

    H5.define("Wischi.LD46.KeepItAlive.TreeBuilder", {
        statics: {
            fields: {
                TAU: 0
            },
            ctors: {
                init: function () {
                    this.TAU = 6.283185307179586;
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
                this.MaxRotationFactor = 0.3141592653589793;
                this.BranchSpreadMin = 0.6283185307179586;
                this.BranchSpreadMax = 1.2566370614359172;
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

                var maxDevAngle = 0.6283185307179586;
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

    H5.define("Wischi.LD46.KeepItAlive.TreeSegment", {
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

    H5.define("Wischi.LD46.KeepItAlive.Vector2D", {
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
                var h = H5.addHash([3096827845, this.X, this.Y]);
                return h;
            },
            equals: function (o) {
                if (!H5.is(o, Wischi.LD46.KeepItAlive.Vector2D)) {
                    return false;
                }
                return H5.equals(this.X, o.X) && H5.equals(this.Y, o.Y);
            },
            $clone: function (to) { return this; }
        }
    });

    H5.define("Wischi.LD46.KeepItAlive.WebH5.Program", {
        main: function Main (args) {
            var $s = 0,
                $t1, 
                $tr1, 
                $jff, 
                $tcs = new System.Threading.Tasks.TaskCompletionSource(), 
                $rv, 
                UpdateStateAndDraw, 
                Draw, 
                canvas, 
                loader, 
                context, 
                waterTask, 
                resetTask, 
                water, 
                reset, 
                slider, 
                drawer, 
                $ae, 
                $asyncBody = H5.fn.bind(this, function () {
                    try {
                        for (;;) {
                            $s = System.Array.min([0,1], $s);
                            switch ($s) {
                                case 0: {
                                    UpdateStateAndDraw = null;
                                    Draw = null;
                                    Wischi.LD46.KeepItAlive.WebH5.Program.SetupHtml();
                                    if (!(((canvas = document.getElementById("canvas"))) != null)) {
                                        console.error("Canvas not found. Exiting.");
                                        $tcs.setResult(null);
                                        return;
                                    }

                                    loader = new Wischi.LD46.KeepItAlive.BridgeNet.LoadingDrawer(canvas);
                                    loader.Draw();

                                    Wischi.LD46.KeepItAlive.WebH5.Program.MigrateSettings();
                                    Wischi.LD46.KeepItAlive.WebH5.Program.SetHashAsSyncToken();

                                    Wischi.LD46.KeepItAlive.WebH5.Program.treeStateStore.addSyncTokenChanged(function (s, e) {
                                        window.location.hash = "#" + (Wischi.LD46.KeepItAlive.WebH5.Program.treeStateStore.SyncToken || "");
                                    });

                                    context = new Wischi.LD46.KeepItAlive.BridgeNet.TreeAppContext(Wischi.LD46.KeepItAlive.WebH5.Program.clock, Wischi.LD46.KeepItAlive.WebH5.Program.config, Wischi.LD46.KeepItAlive.WebH5.Program.treeStateStore, Wischi.LD46.KeepItAlive.WebH5.Program.treeStateFactory, Wischi.LD46.KeepItAlive.WebH5.Program.sharedDrawingState);

                                    context.Initialize();
                                    context.UpdateGameState();

                                    waterTask = Wischi.LD46.KeepItAlive.WebH5.Program.LoadImageAsync("img/water.png");
                                    resetTask = Wischi.LD46.KeepItAlive.WebH5.Program.LoadImageAsync("img/reset.png");
                                    context.AutoSave();

                                    $t1 = System.Threading.Tasks.Task.whenAll(waterTask, resetTask);
                                    $s = 1;
                                    if ($t1.isCompleted()) {
                                        continue;
                                    }
                                    $t1.continue($asyncBody);
                                    return;
                                }
                                case 1: {
                                    $tr1 = $t1.getAwaitedResult();
                                    water = waterTask.getResult();
                                    reset = resetTask.getResult();
                                    if (((slider = document.getElementById("slider"))) != null) {
                                        slider.addEventListener("input", function () {
                                            var factor = System.Int32.parse(slider.value) / 100.0;
                                            context.TreeBehaviour.TreeState.Growth = factor;
                                        });
                                    }

                                    drawer = new Wischi.LD46.KeepItAlive.BridgeNet.TreeDrawer(canvas, water, reset, Wischi.LD46.KeepItAlive.WebH5.Program.sharedDrawingState);
                                    Draw = function () {
                                        context.UpdatePreRender();
                                        drawer.Draw();
                                    };
                                    UpdateStateAndDraw = function () {
                                        context.UpdateGameState();
                                        Draw();
                                    };

                                    window.onhashchange = function (_) {
                                        Wischi.LD46.KeepItAlive.WebH5.Program.SetHashAsSyncToken();
                                        context.Initialize();
                                        UpdateStateAndDraw();
                                    };





                                    water.addEventListener("load", UpdateStateAndDraw);

                                    canvas.addEventListener("click", function (e) {
                                        var me;
                                        if (!(((me = e)) != null)) {
                                            return;
                                        }

                                        var rect = e.target.getBoundingClientRect();
                                        var x = Math.floor(e.clientX - rect.left);
                                        var y = Math.floor(e.clientY - rect.top);

                                        var xx = x;
                                        var yy = y;

                                        if (xx <= 80 && yy >= 430) {
                                            if (context.TreeBehaviour.TreeState.Health === 0) {
                                                context.ResetTree();
                                            } else {
                                                context.Water();
                                            }

                                            UpdateStateAndDraw();
                                        }
                                    });

                                    window.setInterval(function (_) {
                                        Draw();
                                    }, Wischi.LD46.KeepItAlive.WebH5.Program.config.MsRefreshRate);
                                    window.setInterval(function (_) {
                                        context.UpdateGameState();
                                    }, Wischi.LD46.KeepItAlive.WebH5.Program.config.MsTickRate);
                                    window.setInterval(function (_) {
                                        context.AutoSave();
                                    }, Wischi.LD46.KeepItAlive.WebH5.Program.config.MsAutoSave);

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
                    } catch($ae1) {
                        $ae = System.Exception.create($ae1);
                        $tcs.setException($ae);
                    }
                }, arguments);

            $asyncBody();
            return $tcs.task;
        },
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
                ctor: function () {
                    Wischi.LD46.KeepItAlive.WebH5.Program.rng = new System.Random.ctor();
                    Wischi.LD46.KeepItAlive.WebH5.Program.clock = new Wischi.LD46.KeepItAlive.BridgeNet.BrowserJsClock();
                    Wischi.LD46.KeepItAlive.WebH5.Program.config = Wischi.LD46.KeepItAlive.BridgeNet.TreeEnvironmentConfigs.NonZensMode;
                    Wischi.LD46.KeepItAlive.WebH5.Program.sharedDrawingState = new Wischi.LD46.KeepItAlive.BridgeNet.SharedDrawingState();

                    Wischi.LD46.KeepItAlive.WebH5.Program.treeStateFactory = new Wischi.LD46.KeepItAlive.BridgeNet.TreeStateFactory(Wischi.LD46.KeepItAlive.WebH5.Program.rng, Wischi.LD46.KeepItAlive.WebH5.Program.clock, Wischi.LD46.KeepItAlive.WebH5.Program.config);
                    Wischi.LD46.KeepItAlive.WebH5.Program.treeStateStore = new Wischi.LD46.KeepItAlive.BridgeNet.TreeStateStore(Wischi.LD46.KeepItAlive.WebH5.Program.config.SettingPrefix);
                }
            },
            methods: {
                LoadImageAsync: function (src) {
                    var imageElement = document.createElement("img");
                    var completionSource = new System.Threading.Tasks.TaskCompletionSource();
                    imageElement.src = src;

                    imageElement.addEventListener("load", function () {
                        completionSource.setResult(imageElement);
                    });

                    return completionSource.task;
                },
                MigrateSettings: function () {
                    var legacyStateStore = new Wischi.LD46.KeepItAlive.BridgeNet.LocalStorageLegacyTreeStateStore(Wischi.LD46.KeepItAlive.WebH5.Program.config.SettingPrefix);

                    var state = legacyStateStore.Get();

                    if (state != null) {
                        Wischi.LD46.KeepItAlive.WebH5.Program.treeStateStore.Set(state);
                        legacyStateStore.RemoveLegacy();
                    }
                },
                SetHashAsSyncToken: function () {
                    var hs = window.location.hash;

                    if (System.String.startsWith(hs, "#")) {
                        hs = hs.substr(1);
                    }

                    if (!System.String.isNullOrWhiteSpace(hs)) {
                        Wischi.LD46.KeepItAlive.WebH5.Program.treeStateStore.SyncToken = hs;
                    } else {
                        window.location.hash = "#" + (Wischi.LD46.KeepItAlive.WebH5.Program.treeStateStore.SyncToken || "");
                    }
                },
                SetupHtml: function () {
                    document.title = "\ud83c\udf33 - ZenTuree";
                    var bs = document.body.style;

                    bs.margin = "0px";
                    bs.padding = "0px";
                    bs.backgroundColor = "#333";

                    var screen = tss.UI.Canvas(tss.UI._$2(void 0, "canvas", void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0, function (s) {
                        s.border = "solid 5px black";
                    }));

                    screen.setAttribute("width", "512");
                    screen.setAttribute("height", "512");

                    var center_div = tss.UI.Div(tss.UI._$2(void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0, function (s) {
                        s.position = "fixed";
                        s.top = "50%";
                        s.left = "50%";
                        s.transform = "translate(-50%, -50%)";
                    }), screen);

                    document.body.appendChild(center_div);
                }
            }
        }
    });

    H5.define("Wischi.LD46.KeepItAlive.BridgeNet.BrowserJsClock", {
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
    H5.define("Wischi.LD46.KeepItAlive.BridgeNet.LocalStorageLegacyTreeStateStore", {
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
                var seedValue = window.localStorage.getItem(this.seedKey);
                var tickValue = window.localStorage.getItem(this.tickKey);
                var startValue = window.localStorage.getItem(this.startKey);
                var growthValue = window.localStorage.getItem(this.growthKey);
                var healthValue = window.localStorage.getItem(this.healthKey);
                var waterLevelValue = window.localStorage.getItem(this.waterLevelKey);
                var lastUpdateValue = window.localStorage.getItem(this.lastUpdateKey);
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
                window.localStorage.setItem(this.seedKey, H5.toString(treeState.Seed));
                window.localStorage.setItem(this.tickKey, H5.toString(treeState.Ticks));
                window.localStorage.setItem(this.healthKey, System.Double.format(treeState.Health));
                window.localStorage.setItem(this.growthKey, System.Double.format(treeState.Growth));
                window.localStorage.setItem(this.startKey, System.Double.format(treeState.StartTimestamp));
                window.localStorage.setItem(this.waterLevelKey, System.Double.format(treeState.WaterLevel));
                window.localStorage.setItem(this.lastUpdateKey, System.Double.format(treeState.LastEventTimestamp));
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

    H5.define("Wischi.LD46.KeepItAlive.RandomWrapper", {
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
