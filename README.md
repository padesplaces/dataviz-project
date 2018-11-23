# Life inside an echo chamber
<p align="center"><img src="doc/screenshot.png" width="500"/></p>

## Visualizing which news outlets share similar agendas
### Initial idea proposal
With the advent of social media and personalized activity feeds like Facebook and Twitter, our news consumption has become increasingly unvaried. This has lead to the phenomenon referred today as the "echo chamber", where one's confirmation bias is reinforced by the constant exposition to pre-selected subsets of news and opinions already in agreement with one's own views. 

By showing the relationships between news sources, in terms of how they share similar stories, sources and political agendas, our objective is to raise the viewer's awareness of the fake idea of consensus and objective truth that could emerge from a stale news diet, and which unfortunately often leads to the propagation of dumb-founded conspiracy theories. 

Better yet, we would like to confront the viewer with their bias and offer a new perspective by allowing them to explore what type of information they would be exposed to inside a different bubble. Often times in today's divided society, people of diverging political opinions do not even share the same basis of facts on which to have a discussion, and getting a glimpse of what the other side is seeing is a first step towards reconciliation. 

There are different paths we would like to explore in order to reach these objectives. At this point in time, potential candidates for our visualization are the following:

1) For a given logical subset of events (based on type of event, virality factor, geography, etc...), display which news outlets reported it and aggregate them into clusters that share similar views and topics. Additionally, allow the user to pre-select and compare interesting use cases, such as the 2016 American Election, worldwide immigration, terrorism and wars, and so forth.

2) For a particular selection of news sources, represent these source's bias in terms of content and opinion on particular topics and categories. Then, compare this with a more neutral sample and / or another sample that would be biased in the opposite way.

3) In addition to point 2), reconstruct what a typical news feed from a set of sources would look like.

4) Display the coverage of certain categories of news and compare it with a more objective measure of the overall importance of such events.

### Intermediary follow up


## Setup
There are several directories in this repository:
- **data/** containing precomputed networks using our data exploration
- **doc/** containing a backup of our documentation (for every submission)
- **visualizations_alternatives/** other visualizations we explored to display our data
