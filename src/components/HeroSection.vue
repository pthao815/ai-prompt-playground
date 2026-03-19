<template>
  <section class="relative min-h-screen flex flex-col items-center justify-center px-6 py-24 overflow-hidden text-center">

    <!-- Background glow -->
    <div class="absolute inset-0 pointer-events-none" aria-hidden="true">
      <div
        class="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2
               w-[700px] h-[700px] rounded-full
               bg-purple-600/10 blur-[120px]"
      />
      <div
        class="absolute bottom-0 right-1/4
               w-[400px] h-[400px] rounded-full
               bg-purple-900/10 blur-[100px]"
      />
    </div>

    <!-- Grid overlay -->
    <div
      class="absolute inset-0 pointer-events-none opacity-[0.03]"
      style="background-image: linear-gradient(#aa3bff 1px, transparent 1px), linear-gradient(90deg, #aa3bff 1px, transparent 1px); background-size: 60px 60px;"
      aria-hidden="true"
    />

    <!-- Badge -->
    <div class="relative inline-flex items-center gap-2 px-4 py-1.5 mb-8
                rounded-full border border-purple-500/30
                bg-purple-500/10 text-purple-300 text-sm font-medium
                tracking-wide">
      <span class="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
      Now in Open Beta — Free to Start
    </div>

    <!-- H1 -->
    <h1 class="relative max-w-3xl text-5xl sm:text-6xl md:text-7xl font-bold
               text-white leading-[1.05] tracking-tight mb-6">
      Master Prompts.
      <span class="bg-gradient-to-r from-purple-400 to-violet-300 bg-clip-text text-transparent">
        Ship Smarter AI.
      </span>
    </h1>

    <!-- H2 / Subheadline -->
    <h2 class="relative max-w-xl text-lg sm:text-xl text-gray-400 leading-relaxed mb-10 font-normal">
      The playground where developers and builders craft prompts
      that actually work — in seconds.
    </h2>

    <!-- CTA group -->
    <div class="relative flex flex-col sm:flex-row items-center gap-4 mb-6">
      <button
        type="button"
        class="group px-8 py-4 rounded-xl font-semibold text-base text-white
               bg-gradient-to-r from-purple-600 to-violet-500
               hover:from-purple-500 hover:to-violet-400
               shadow-[0_0_30px_rgba(170,59,255,0.3)]
               hover:shadow-[0_0_45px_rgba(170,59,255,0.5)]
               transition-all duration-300 cursor-pointer"
      >
        Start Prompting Free
        <span class="ml-2 inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
      </button>

      <button
        type="button"
        class="px-8 py-4 rounded-xl font-semibold text-base text-gray-300
               border border-gray-700 hover:border-purple-500/50
               hover:text-white hover:bg-white/5
               transition-all duration-300 cursor-pointer"
      >
        Watch Demo
      </button>
    </div>

    <!-- Micro copy -->
    <p class="relative text-sm text-gray-500">
      No credit card. No setup. Results in 60 seconds.
    </p>

    <!-- Scroll indicator -->
    <div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-40">
      <span class="text-xs text-gray-500 tracking-widest uppercase">Scroll</span>
      <div class="w-px h-8 bg-gradient-to-b from-gray-500 to-transparent" />
    </div>

  </section>
</template>
