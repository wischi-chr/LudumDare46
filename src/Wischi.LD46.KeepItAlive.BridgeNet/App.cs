using Bridge.Html5;
using System;
using System.Collections.Generic;

namespace Wischi.LD46.KeepItAlive.BridgeNet
{
    public class App
    {
        private readonly HTMLCanvasElement canvas;
        private readonly CanvasRenderingContext2D ctx;
        private readonly Random rnd = new Random();
        private readonly PixelScreen pixelScreen;
        private readonly TreeSegment trunk;
        private readonly TreeDrawingContext treeDrawingContext;

        public App(HTMLCanvasElement canvas)
        {
            this.canvas = canvas;
            canvas.Width = 512;
            canvas.Height = 512;

            pixelScreen = new PixelScreen();

            ctx = canvas.GetContext(CanvasTypes.CanvasContext2DType.CanvasRenderingContext2D);


            pixelScreen.SetPixel(0, 0, true);

            //for (var y = 0; y < pixelScreen.Height; y++)
            //{
            //    for (var x = 0; x < pixelScreen.Width; x++)
            //    {
            //        pixelScreen.SetPixel(x, y, true);
            //    }
            //}

            //ctx.PutImageData(pixelScreen.ImageData, 0, 0);


            var rndSource = new RandomWrapper();
            var treeBuilder = new TreeBuilder(rndSource);
            trunk = treeBuilder.BuildTree();

            treeDrawingContext = new TreeDrawingContext(ctx)
            {
                ScaleFactor = 80,
                StartX = 256,
                StartY = 512,
            };

            SetGrowState(1, 1);

            Console.WriteLine("Welcome to Bridge.NET");
        }

        public void SetGrowState(double growth, double thicknessLimit)
        {
            ctx.ClearRect(0, 0, 512, 512);

            treeDrawingContext.GrowthFactor = growth;
            treeDrawingContext.ThicknessLimit = 0.02 * (1 - thicknessLimit);

            treeDrawingContext.DrawTree(trunk);
        }
    }

    public class TreeDrawingContext
    {
        private const double TAU = Math.PI * 2;

        private readonly CanvasRenderingContext2D ctx;

        public TreeDrawingContext(CanvasRenderingContext2D ctx)
        {
            this.ctx = ctx ?? throw new ArgumentNullException(nameof(ctx));
        }

        private int DepthLimit => 14;

        public double GrowthFactor { get; set; }
        public double ScaleFactor { get; set; }
        public double StartX { get; set; }
        public double StartY { get; set; }
        public double ThicknessLimit { get; set; }

        public void DrawTree(TreeSegment treeTrunk)
        {
            if (treeTrunk is null)
            {
                throw new ArgumentNullException(nameof(treeTrunk));
            }

            DrawSegmentInternal(treeTrunk, StartX, StartY, 0.25 * TAU);
        }

        private double EaseInQuad(double x)
        {
            return x * x * x * x;
        }

        private double EaseInQuadOffset(double x)
        {
            x = x * 0.5 + 0.5;
            return x * x * x * x;
        }

        private double EaseLinear(double x)
        {
            return x;
        }

        private double EaseInExp(double factor)
        {
            if (factor <= 0)
            {
                return 0;
            }

            return Math.Pow(2, 10 * factor - 10);
        }

        private Func<double, double> EaseDepth => EaseInQuadOffset;
        private Func<double, double> EaseThickness => EaseInQuadOffset;
        private Func<double, double> EaseDeviation => EaseLinear;

        private void DrawSegmentInternal(TreeSegment currentSegment, double x, double y, double lastBranchAbsoluteAngle)
        {
            var floatingDepth = DepthLimit * EaseDepth(GrowthFactor);

            var lowerDepth = (int)floatingDepth;
            var upperDepth = lowerDepth + 1;

            if (currentSegment.Depth > upperDepth)
            {
                return;
            }

            var depthLengthScale = Math.Max(Math.Min(1.0, floatingDepth - currentSegment.Depth), 0);

            var effectiveDeviationAngle = currentSegment.DeviationAngle * (EaseDeviation(GrowthFactor) * 0.3 + 0.7);

            var currentBranchAbsoluteAngle = lastBranchAbsoluteAngle + effectiveDeviationAngle;
            var length = currentSegment.Length * ScaleFactor * GrowthFactor * depthLengthScale;

            var dx = Math.Cos(currentBranchAbsoluteAngle) * length;
            var dy = Math.Sin(currentBranchAbsoluteAngle) * length;

            var internalThickness = currentSegment.Thickness * GrowthFactor * EaseThickness(GrowthFactor) * depthLengthScale;

            if (internalThickness < ThicknessLimit)
            {
                return;
            }

            if (internalThickness > 0.02)
            {
                ctx.StrokeStyle = "#421208";
            }
            else
            {
                ctx.StrokeStyle = "#206411";
            }

            ctx.BeginPath();
            ctx.MoveTo(x, y);

            x += dx;
            y += -dy;

            ctx.LineTo(x, y);
            ctx.LineWidth = internalThickness * ScaleFactor;
            ctx.Stroke();

            foreach (var branch in currentSegment.Branches)
            {
                DrawSegmentInternal(branch, x, y, currentBranchAbsoluteAngle);
            }
        }
    }

    public class PixelScreenSegmentWriter : IPixelScreenWriter
    {
        public PixelScreenSegmentWriter(IPixelScreenWriter pixelScreenWriter)
        {

        }

        public void SetPixel(int x, int y, bool set)
        {
            throw new NotImplementedException();
        }
    }

    public class PixelScreen
    {
        public PixelScreen()
        {
            ImageData = new ImageData((uint)Width, (uint)Height);

            // Set alpha channel to visible and pixel to white;
            for (var i = 0; i < ImageData.Data.Length; i += 4)
            {
                ImageData.Data[i + 0] = 255;
                ImageData.Data[i + 1] = 255;
                ImageData.Data[i + 2] = 255;
                ImageData.Data[i + 3] = 255;
            }
        }

        public int Width => 64;
        public int Height => 64;

        public ImageData ImageData { get; }

        public void SetPixel(int x, int y, bool set)
        {
            if (x < 0 || x >= Width || y < 0 || y >= Height)
            {
                return;
            }

            var value = set ? (byte)0 : (byte)255;
            var arrayPosition = (y * Width + x) * 4;

            // Set RGB to same color (black & white only)
            ImageData.Data[arrayPosition + 0] = value;
            ImageData.Data[arrayPosition + 1] = value;
            ImageData.Data[arrayPosition + 2] = value;
        }
    }
}
