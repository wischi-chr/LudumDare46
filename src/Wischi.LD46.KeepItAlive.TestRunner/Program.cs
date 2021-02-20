using System;

namespace Wischi.LD46.KeepItAlive.TestRunner
{
    internal static class Program
    {
        private static void Main(string[] args)
        {
            var seed = new Random().Next();
            var rndSource = new RandomWrapper(seed);
            var treeBuilder = new TreeBuilder(rndSource);
            var tree = treeBuilder.BuildTree();
        }
    }
}
