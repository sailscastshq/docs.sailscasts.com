---
title: Open Source
titleTemplate: Sailscasts
description: Open source projects built and maintained by Sailscasts
layout: page
---

<script setup>
import { data } from './.vitepress/data/projects.data.js'
</script>

<ProjectGrid
  :projects="data.openSource"
  type="open-source"
  title="Open Source"
  description="We build tools to make full-stack JavaScript development enjoyable. All our open source projects are released under the MIT License."
/>
