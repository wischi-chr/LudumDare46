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

        public App(HTMLCanvasElement canvas)
        {
            this.canvas = canvas;
            canvas.Width = 256;
            canvas.Height = 256;

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

            SetGrowState(1);

            Console.WriteLine("Welcome to Bridge.NET");
        }

        public void SetGrowState(double value)
        {
            var depthLimit = (int)(12 * value);
            DrawTree(trunk, 40, value, 0.1, depthLimit);
        }

        public void DrawTree(TreeSegment trunkSegment, double factor, double growFactor, double thicknessLevel, int depthLimit)
        {
            ctx.FillStyle = "#000";
            ctx.ClearRect(0, 0, 256, 256);
            DrawTreeSegment(trunkSegment, factor, 128, 256, growFactor, thicknessLevel, depthLimit);
        }

        private void DrawTreeSegment(TreeSegment currentSegment, double factor, double x, double y, double growFactor, double thicknessLimit, int depthLimit)
        {
            if (currentSegment.Depth >= depthLimit)
            {
                return;
            }

            ctx.BeginPath();
            ctx.MoveTo(x, y);

            x += currentSegment.Vector.X * factor * growFactor;
            y += -currentSegment.Vector.Y * factor * growFactor;

            ctx.LineTo(x, y);
            ctx.LineWidth = currentSegment.Thickness * factor * growFactor;
            ctx.Stroke();

            foreach (var branch in currentSegment.Branches)
            {
                DrawTreeSegment(branch, factor, x, y, growFactor, thicknessLimit, depthLimit);
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
